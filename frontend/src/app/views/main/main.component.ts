import {Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticleType} from "../../../types";
import {ArticleService, ModalService} from "../../shared";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})


export class MainComponent implements OnInit {

  protected customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplaySpeed: 1500,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  };

  protected customOptionsOpinions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 24,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false
  };

  protected topArticles: ArticleType[] = [];

  constructor(private readonly articleService: ArticleService,
              private readonly modalService: ModalService) {
  }

  public ngOnInit(): void {
    this.articleService.getTopArticles()
      .subscribe((data: ArticleType[]): void => {
        this.topArticles = data;
      });
  }

  protected openOrder(service: string): void {
    this.modalService.open('order', { service });
  }

  protected openConsultation(): void {
    this.modalService.open('consultation');
  }
}


