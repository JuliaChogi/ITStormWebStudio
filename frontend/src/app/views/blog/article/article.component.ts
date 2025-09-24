import { Component, OnInit } from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ActivatedRoute} from "@angular/router";
import {ArticleContentType} from "../../../../types/article-content.type";
import {environment} from "../../../../environments/environment";
import {ArticleType} from "../../../../types/article.type";

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
              ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticleContent(params['url'])
        .subscribe((data: ArticleContentType) => {
          this.articleContent = data;
          console.log(data)

          this.articleService.getRelatedArticles(params['url'])
            .subscribe((data: ArticleType[]) => {
              this.relatedArticles = data;
              console.log(data);
            })
        })
    })
  }

}
