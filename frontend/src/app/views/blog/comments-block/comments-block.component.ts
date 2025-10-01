import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AuthService} from '../../../core/auth/auth.service';
import {CommentService} from '../../../shared/services/comment.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CommentType} from '../../../../types';

@Component({
  selector: 'app-comments-block',
  templateUrl: './comments-block.component.html',
  styleUrls: ['./comments-block.component.scss']
})
export class CommentsBlockComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  comments: CommentType[] = [];
  allCount = 0;
  commentText = '';
  isLogged = false;

  private _articleId = '';
  @Input()
  set articleId(value: string) {
    this._articleId = value;
    if (value) {
      this.loadComments(0);
    }
  }

  get articleId() {
    return this._articleId;
  }

  @Input() commentsCount = 0;

  constructor(
    private authService: AuthService,
    private commentService: CommentService,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.authService.isLogged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLogged => this.isLogged = isLogged);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadComments(offset: number = 0): void {
    if (!this.articleId) return;

    this.commentService.getComments(this.articleId, offset)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        let newComments = response.comments;

        if (offset === 0) {
          this.comments = newComments.slice(0, 3);
        } else {
          this.comments = [...this.comments, ...newComments];
        }

        this.allCount = response.allCount;
        this.commentService.getArticleCommentActions(this.articleId)
          .pipe(takeUntil(this.destroy$))
          .subscribe(actions => {
            const actionsMap = new Map(actions.map(a => [a.comment, a.action]));
            this.comments.forEach(comment => {
              comment.userReaction = actionsMap.get(comment.id) || null;
            });
          });
      });
  }

  onAddComment(): void {
    if (!this.commentText.trim()) return;

    this.commentService.addComment(this.articleId, this.commentText)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this._snackBar.open('Комментарий успешно добавлен!');
          this.commentText = '';
          this.loadComments(0);
        },
        error: (err) => {
          this._snackBar.open(err);
          console.error('Ошибка добавления комментария', err);
        }
      });
  }

  onCommentAction(comment: CommentType, action: 'like' | 'dislike' | 'violate'): void {
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
                .subscribe(actions => {
                  const actionsMap = new Map(actions.map(a => [a.comment, a.action]));
                  this.comments.forEach(c => {
                    c.userReaction = actionsMap.get(c.id) || null;
                  });
                });
            }
          },
          error: (err) => {
            if (action === 'violate' && err?.error?.message === 'Это действие уже применено к комментарию') {
              this._snackBar.open('Жалоба уже отправлена');
            } else {
              console.error('Ошибка:', err);
            }
          }
        });
    } else {
      this._snackBar.open('Для данного действия требуется авторизация!')
    }
  }

  loadMoreComments(): void {
    this.loadComments(this.comments.length);
  }
}
