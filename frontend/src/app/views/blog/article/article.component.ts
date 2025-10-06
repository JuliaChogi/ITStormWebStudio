import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ArticleContentType, ArticleType, CommentType } from '../../../../types';
import { ArticleService, CommentService } from '../../../shared';
import { AuthService } from '@core/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, OnDestroy {

  private articleId: string = '';
  protected articleContent: ArticleContentType | null = null;
  protected relatedArticles: ArticleType[] = [];
  protected comments: CommentType[] = [];
  protected commentsAllCount: number = 0;
  protected commentText: string = '';
  protected isLogged: boolean = false;

  protected serverStaticPath: string = environment.serverStaticPath;

  private destroy$ = new Subject<void>();

  constructor(
    private readonly articleService: ArticleService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly commentService: CommentService,
    private readonly _snackBar: MatSnackBar
  ) {}

  public ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params): void => {
        const url = params['url'];
        this.articleService.getArticleContent(url)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: ArticleContentType): void => {
            this.articleContent = data;
            this.articleId = data.id;

            this.articleService.getRelatedArticles(url)
              .pipe(takeUntil(this.destroy$))
              .subscribe((related: ArticleType[]): void => {
                this.relatedArticles = related;
              });

            this.loadComments(0);
          });
      });

    this.authService.isLogged$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLogged: boolean) => this.isLogged = isLogged);
  }

  private loadComments(offset: number = 0): void {
    if (!this.articleId) return;

    this.commentService.getComments(this.articleId, offset)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: { allCount: number; comments: CommentType[] }): void => {
        const newComments: CommentType[] = response.comments;
        this.comments = offset === 0 ? newComments.slice(0, 3) : [...this.comments, ...newComments];
        this.commentsAllCount = response.allCount;

        this.commentService.getArticleCommentActions(this.articleId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((actions: { comment: string; action: 'like' | 'dislike' }[]): void => {
            const actionsMap = new Map(actions.map(a => [a.comment, a.action]));
            this.comments.forEach((comment: CommentType): void => {
              comment.userReaction = actionsMap.get(comment.id) || null;
            });
          });
      });
  }

  protected onAddComment(): void {
    if (!this.commentText.trim() || !this.articleId) return;

    this.commentService.addComment(this.articleId, this.commentText)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (): void => {
          this._snackBar.open('Комментарий успешно добавлен!', '', { duration: 2000 });
          this.commentText = '';
          this.loadComments(0);
        },
        error: (err): void => {
          console.error('Ошибка добавления комментария', err);
          this._snackBar.open('Ошибка при добавлении комментария', '', { duration: 2000 });
        }
      });
  }

  protected onCommentAction(comment: CommentType, action: 'like' | 'dislike' | 'violate'): void {
    if (!this.isLogged) {
      this._snackBar.open('Для данного действия требуется авторизация!', '', { duration: 2000 });
      return;
    }

    this.commentService.applyAction(comment.id, action)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (): void => {
          if (comment.userReaction === 'like') comment.likesCount--;
          if (comment.userReaction === 'dislike') comment.dislikesCount--;

          comment.userReaction = action;
          if (action === 'like') comment.likesCount++;
          if (action === 'dislike') comment.dislikesCount++;

          this._snackBar.open(
            action === 'violate' ? 'Жалоба принята' : 'Ваш голос учтён',
            '',
            { duration: 2000 }
          );

          if (action !== 'violate') {
            this.commentService.getArticleCommentActions(this.articleId)
              .pipe(takeUntil(this.destroy$))
              .subscribe((actions: { comment: string; action: 'like' | 'dislike' }[]) => {
                const actionsMap = new Map(actions.map(a => [a.comment, a.action]));
                this.comments.forEach((c: CommentType): void => {
                  c.userReaction = actionsMap.get(c.id) || null;
                });
              });
          }
        },
        error: (err): void => {
          if (action === 'violate' && err?.error?.message === 'Это действие уже применено к комментарию') {
            this._snackBar.open('Жалоба уже отправлена', '', { duration: 2000 });
          } else {
            console.error('Ошибка:', err);
          }
        }
      });
  }

  protected loadMoreComments(): void {
    this.loadComments(this.comments.length);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
