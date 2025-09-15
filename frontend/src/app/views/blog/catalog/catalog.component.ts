import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArticleService } from '../../../shared/services/article.service';
import { ArticleType } from '../../../../types/article.type';
import { ArticleCategoryType } from '../../../../types/article-category.type';
import { ActiveParamsUtil } from '../../../shared/utils/active-params.util';
import { ActiveParamsType } from '../../../../types/active-params.type';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit, OnDestroy {
  articles: ArticleType[] = [];
  articleCategories: ArticleCategoryType[] = [];
  selectedCategories: string[] = [];

  currentPage = 1;
  pages = 1;
  count = 0;

  dropdownOpen = false;

  private destroy$ = new Subject<void>();

  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.articleService.getArticleCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.articleCategories = data;
      });

    // читаем параметры из URL и при их изменении — загружаем статьи
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        const active: ActiveParamsType = ActiveParamsUtil.processParams(params);

        this.selectedCategories = active.categories || [];
        this.currentPage = active.page || 1;
        this.loadArticles();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //загрузка статей с параметрами
  private loadArticles(): void {
    const params: ActiveParamsType = {
      categories: this.selectedCategories,
      page: this.currentPage
    };

    this.articleService.getArticles(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.articles = response.items;
          this.pages = response.pages || 1;
          this.count = response.count || 0;
        },
        error: err => {
          console.error('Ошибка при загрузке статей', err);
        }
      })
  }

  // получаем имя категории по url
  getCategoryNameByUrl(url: string): string {
    const categoryName = this.articleCategories.find(x => x.url === url);
    return categoryName ? categoryName.name : url;
  }

  isSelected(categoryUrl: string): boolean {
    return this.selectedCategories.includes(categoryUrl);
  }

  toggleCategory(categoryUrl: string): void {
    if (this.isSelected(categoryUrl)) {
      this.selectedCategories = this.selectedCategories.filter(cat => cat !== categoryUrl);
    } else {
      this.selectedCategories = [...this.selectedCategories, categoryUrl];
    }

    this.currentPage = 1;
    this.updateUrl();
  }

  removeFilter(categoryUrl: string): void {
    this.toggleCategory(categoryUrl);
  }

  updateUrl(): void {
    const queryParams: Params = {};

    if (this.currentPage && this.currentPage !== 1) {
      queryParams["page"] = this.currentPage;
    }

    if (this.selectedCategories && this.selectedCategories.length) {
      queryParams["categories"] = this.selectedCategories;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pages || page === this.currentPage) return;
    this.currentPage = page;
    this.updateUrl();
  }

  prevPage(): void {
    if (this.currentPage > 1) this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    if (this.currentPage < this.pages) this.goToPage(this.currentPage + 1);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.pages }, (_, i) => i + 1);
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }
  openDropdown() {
    this.dropdownOpen = true;
  }
}
