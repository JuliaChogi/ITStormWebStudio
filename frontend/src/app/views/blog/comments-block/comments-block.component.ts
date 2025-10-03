import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CommentType} from '../../../../types';
import {AuthService} from "../../../core";
import {CommentService} from "../../../shared";

@Component({
  selector: 'app-comments-block',
  templateUrl: './comments-block.component.html',
  styleUrls: ['./comments-block.component.scss']
})
export class CommentsBlockComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  protected comments: CommentType[] = [];
  protected allCount: number = 0;
  protected commentText: string = '';
  protected isLogged: boolean = false;

  private _articleId: string = '';
  @Input()
  set articleId(value: string) {
    this._articleId = value;
    if (value) {
      this.loadComments(0);
    }
  }

  public get articleId() {
    return this._articleId;
  }

  @Input() commentsCount: number = 0;

  constructor(
    private readonly authService: AuthService,
    private readonly commentService: CommentService,
    private readonly _snackBar: MatSnackBar
  ) {
  }

  public ngOnInit(): void {
    this.authService.isLogged$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLogged: boolean) => this.isLogged = isLogged);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadComments(offset: number = 0): void {
    if (!this.articleId) return;

    this.commentService.getComments(this.articleId, offset)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: { allCount: number; comments: CommentType[] }): void => {
        let newComments: CommentType[] = response.comments;

        if (offset === 0) {
          this.comments = newComments.slice(0, 3);
        } else {
          this.comments = [...this.comments, ...newComments];
        }

        this.allCount = response.allCount;
        this.commentService.getArticleCommentActions(this.articleId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((actions: { comment: string; action: "like" | "dislike" }[]): void => {
            const actionsMap = new Map(actions.map(a => [a.comment, a.action]));
            this.comments.forEach((comment: CommentType): void => {
              comment.userReaction = actionsMap.get(comment.id) || null;
            });
          });
      });
  }

  protected onAddComment(): void {
    if (!this.commentText.trim()) return;

    this.commentService.addComment(this.articleId, this.commentText)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this._snackBar.open('Комментарий успешно добавлен!');
          this.commentText = '';
          this.loadComments(0);
        },
        error: (err): void => {
          this._snackBar.open(err);
          console.error('Ошибка добавления комментария', err);
        }
      });
  }

  protected onCommentAction(comment: CommentType, action: 'like' | 'dislike' | 'violate'): void {
    if (this.isLogged) {
      this.commentService.applyAction(comment.id, action)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {

            if (comment.userReaction === 'like') comment.likesCount--;
            if (comment.userReaction === 'dislike') comment.dislikesCount--;

            comment.userReaction = action;
            if (action === 'like') comment.likesCount++;
            if (action === 'dislike') comment.dislikesCount++;

            this._snackBar.open(action === 'violate' ? 'Жалоба принята' : 'Ваш голос учтен');

            if (action !== 'violate') {
              this.commentService.getArticleCommentActions(this.articleId)
                .pipe(takeUntil(this.destroy$))
                .subscribe((actions: { comment: string; action: "like" | "dislike" }[]) => {
                  const actionsMap = new Map(actions.map(a => [a.comment, a.action]));
                  this.comments.forEach((c: CommentType): void => {
                    c.userReaction = actionsMap.get(c.id) || null;
                  });
                });
            }
          },
          error: (err): void => {
            if (action === 'violate' && err?.error?.message === 'Это действие уже применено к комментарию') {
              this._snackBar.open('Жалоба уже отправлена');
            } else {
              console.error('Ошибка:', err);
            }
          }
        });
    } else {
      this._snackBar.open('Для данного действия требуется авторизация!');
    }
  }

  protected loadMoreComments(): void {
    this.loadComments(this.comments.length);
  }
}
