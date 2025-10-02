import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {ActiveParamsType, ArticleCategoryType, ArticleContentType, ArticleType} from "../../../types";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private readonly http: HttpClient) {
  }

  public getTopArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top');
  }

  public getArticles(params?: ActiveParamsType): Observable<{ count: number, pages: number, items: ArticleType[] }> {
    let httpParams = new HttpParams();
    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.categories && params.categories.length) {
      params.categories.forEach((cat: string): void => {
        httpParams = httpParams.append('categories[]', cat);
      });
    }
    return this.http.get<{
      count: number,
      pages: number,
      items: ArticleType[]
    }>(environment.api + 'articles', {params: httpParams});
  }

  public getArticleContent(url: string): Observable<ArticleContentType> {
    return this.http.get<ArticleContentType>(environment.api + 'articles/' + url);
  }

  public getArticleCategories(): Observable<ArticleCategoryType[]> {
    return this.http.get<ArticleCategoryType[]>(environment.api + 'categories');
  }

  public getRelatedArticles(url: string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/related/' + url);
  }
}
