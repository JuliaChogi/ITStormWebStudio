import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {CommentType} from "../../../types/comment.type";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {
  }

  getComments(articleId: string, offset: number = 0): Observable<{ allCount: number, comments: CommentType[] }> {
    let params = new HttpParams()
      .set('article', articleId)
      .set('offset', offset.toString());

    return this.http.get<{ allCount: number, comments: CommentType[] }>(
      environment.api + 'comments',
      {params}
    );
  }

  addComment(articleId: string, text: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(
      environment.api + 'comments',
      {
        text,
        article: articleId
      }
    );
  }

  applyAction(commentId: string, action: 'like' | 'dislike' | 'violate'): Observable<{
    error: boolean,
    message: string
  }> {
    return this.http.post<{ error: boolean, message: string }>(
      environment.api + 'comments/' + commentId + '/apply-action',
      {action}
    );
  }

  getCommentActions(commentId: string): Observable<{ comment: string, action: 'like' | 'dislike' }[]> {
    return this.http.get<{ comment: string, action: 'like' | 'dislike' }[]>(
      environment.api + 'comments/' + commentId + '/actions',
    );
  }
}
