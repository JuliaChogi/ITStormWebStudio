import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {ArticleContentType, ArticleType} from "../../../../types";
import {ArticleService} from "../../../shared";


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})

export class ArticleComponent implements OnInit {

  articleContent = {
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

  relatedArticles: ArticleType[] = [];
  serverStaticPath = environment.serverStaticPath;

  constructor(private articleService: ArticleService,
              private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticleContent(params['url'])
        .subscribe((data: ArticleContentType) => {
          this.articleContent = data;
          this.articleService.getRelatedArticles(params['url'])
            .subscribe((data: ArticleType[]) => {
              this.relatedArticles = data;
            })
        })
    })
  }
}
