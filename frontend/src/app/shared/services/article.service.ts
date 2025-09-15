import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ArticleType} from "../../../types/article.type";
import {environment} from "../../../environments/environment";
import {ArticleCategoryType} from "../../../types/article-category.type";
import {ActiveParamsType} from "../../../types/active-params.type";


@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  getTopArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top');
  }
  // getArticles(): Observable<{count:number, pages:number, items: ArticleType[]}> {
  //   return this.http.get<{count:number, pages:number, items: ArticleType[]}>(environment.api + 'articles');
  // }


  getArticles(params?: ActiveParamsType): Observable<{count:number, pages:number, items: ArticleType[]}> {
    let httpParams = new HttpParams();
    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.categories && params.categories.length) {
      params.categories.forEach(cat => {
        httpParams = httpParams.append('categories[]', cat);
      });
    }

    return this.http.get<{count:number, pages:number, items: ArticleType[]}>(environment.api + 'articles', { params: httpParams });
  }
  getArticleCategories(): Observable<ArticleCategoryType[]> {
    return this.http.get<ArticleCategoryType[]>(environment.api + 'categories');
  }
}
