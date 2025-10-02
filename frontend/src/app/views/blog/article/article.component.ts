import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {ArticleContentType, ArticleType} from "../../../../types";
import {ArticleService} from "../../../shared";


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})

export class ArticleComponent implements OnInit {

  protected articleContent = {
    text: '',
    comments: [''],
    commentsCount: 0,
    id: '',
    title: '',
    description: '',
    image: '',
    date: '',
    category: '',
    url: ''
  };

  protected relatedArticles: ArticleType[] = [];
  protected serverStaticPath: string = environment.serverStaticPath;

  constructor(private readonly articleService: ArticleService,
              private readonly activatedRoute: ActivatedRoute
  ) {
  }

  public ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.articleService.getArticleContent(params['url'])
        .subscribe((data: ArticleContentType): void => {
          this.articleContent = data;
          this.articleService.getRelatedArticles(params['url'])
            .subscribe((data: ArticleType[]): void => {
              this.relatedArticles = data;
            });
        });
    });
  }
}
