import {Component, Input, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";
import {Router} from "@angular/router";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {
  @Input() article!: ArticleType;
  serverStaticPath = environment.serverStaticPath;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  redirectToArticle(url: string) {
    this.router.navigate(['article', url]).then(() => {
      window.scrollTo(0,0);
    })
  }
}
