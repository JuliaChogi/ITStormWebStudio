import {Component, Input} from '@angular/core';
import {ArticleType} from "../../../../types";
import {environment} from "../../../../environments/environment";
import {Router} from "@angular/router";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {
  @Input() article!: ArticleType;
  protected serverStaticPath: string = environment.serverStaticPath;

  constructor(private readonly router: Router) {
  }

  protected redirectToArticle(url: string): void {
    this.router.navigate(['article', url]).then((): void => {
      window.scrollTo(0,0);
    });
  }
}
