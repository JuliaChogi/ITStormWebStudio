import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {CommentType, DefaultResponseType} from "../../../types";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {
  }

  public getComments(articleId: string, offset: number): Observable<{ allCount: number, comments: CommentType[] }> {
    let params: HttpParams = new HttpParams()
      .set('article', articleId)
      .set('offset', offset.toString());

    return this.http.get<{ allCount: number, comments: CommentType[] }>(
      environment.api + 'comments',
      {params}
    );
  }

  public addComment(articleId: string, text: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(
      environment.api + 'comments',
      {
        text,
        article: articleId
      }
    );
  }

  public applyAction(commentId: string, action: 'like' | 'dislike' | 'violate'): Observable<{
    error: boolean,
    message: string
  }> {
    return this.http.post<{ error: boolean, message: string }>(
      environment.api + 'comments/' + commentId + '/apply-action',
      {action}
    );
  }

  public getArticleCommentActions(articleId: string) {
    return this.http.get<{ comment: string, action: 'like' | 'dislike' }[]>(
      `${environment.api}comments/article-comment-actions`,
      {params: {articleId}}
    );
  }
}


