import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ArticleType} from "../../../types/article.type";
import {environment} from "../../../environments/environment";
import {ArticleCategoryType} from "../../../types/article-category.type";
import {ActiveParamsType} from "../../../types/active-params.type";
import {ArticleContentType} from "../../../types/article-content.type";


@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) {
  }

  getTopArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top');
  }

  getArticles(params?: ActiveParamsType): Observable<{ count: number, pages: number, items: ArticleType[] }> {
    let httpParams = new HttpParams();
    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.categories && params.categories.length) {
      params.categories.forEach(cat => {
        httpParams = httpParams.append('categories[]', cat);
      });
    }
    return this.http.get<{
      count: number,
      pages: number,
      items: ArticleType[]
    }>(environment.api + 'articles', {params: httpParams});
  }

  getArticleContent(url: string): Observable<ArticleContentType> {
    return this.http.get<ArticleContentType>(environment.api + 'articles/' + url)
  }

  getArticleCategories(): Observable<ArticleCategoryType[]> {
    return this.http.get<ArticleCategoryType[]>(environment.api + 'categories');
  }

  getRelatedArticles(url: string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/related/' + url)
  }
}
