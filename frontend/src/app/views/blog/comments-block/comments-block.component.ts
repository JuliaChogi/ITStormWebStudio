import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {takeUntil} from "rxjs/operators";
import {AuthService} from "../../../core/auth/auth.service";
import {Subject} from "rxjs";
import {CommentService} from "../../../shared/services/comment.service";
import {ActivatedRoute} from "@angular/router";
import {CommentType} from "../../../../types/comment.type";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-comments-block',
  templateUrl: './comments-block.component.html',
  styleUrls: ['./comments-block.component.scss']
})
export class CommentsBlockComponent implements OnInit {
  @Input() articleId: string = '';
  @Input() commentsCount: number = 0;

  isLogged = false;
  private destroy$ = new Subject<void>();
  comments: CommentType[] = [];
  allCount = 0;
  commentText: string = '';
  offset = 0;

  constructor(private authService: AuthService,
              private commentService: CommentService,
              private activatedRoute: ActivatedRoute,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.authService.isLogged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLogged => {
        this.isLogged = isLogged;
      });
    this.loadComments(0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['articleId'] && this.articleId) {
      this.loadComments(0);

      if (this.commentsCount === 0) {
        this.comments = [];
        this.allCount = 0;
        return;
      }
      this.loadComments(0);
    }

    if (changes['commentsCount']
      && changes['commentsCount'].previousValue === 0
      && changes['commentsCount'].currentValue > 0
      && this.articleId) {
      this.loadComments(0);
    }
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
        this.comments = response.comments;
        this.allCount = response.allCount;

        this.comments.forEach(comment => {
          this.commentService.getCommentActions(comment.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(actions => {
              const action = actions[0];
              comment.userReaction = action ? action.action : null;
            });
        });
      });
  }

  onAddComment(): void {
    if (!this.commentText.trim()) {
      return;
    }

    this.commentService.addComment(this.articleId, this.commentText)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this._snackBar.open('Комментарий успешно добавлен!')
          this.commentText = '';
          this.loadComments(0);
        },
        error: (err) => {
          this._snackBar.open(err)
          console.error('Ошибка добавления комментария', err);
        }
      });
  }

  onCommentAction(comment: CommentType, action: 'like' | 'dislike' | 'violate'): void {
    this.commentService.applyAction(comment.id, action)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          comment.userReaction = action;

          if (action === 'violate') {
            this._snackBar.open('Жалоба принята');
          } else {
            this._snackBar.open('Ваш голос учтен');
          }

          this.loadComments(0);
        },
        error: (err) => {
          if (action === 'violate' && err?.error?.message === 'Это действие уже применено к комментарию') {
            this._snackBar.open('Жалоба уже отправлена');
          } else {
            console.error('Ошибка:', err);
          }
        }
      });
  }

}
