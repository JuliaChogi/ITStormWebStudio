import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router, Params} from '@angular/router';
import {debounceTime, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ActiveParamsType, ArticleCategoryType, ArticleType} from "../../../../types";
import {ActiveParamsUtil, ArticleService} from "../../../shared";


@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit, OnDestroy {
  public articles: ArticleType[] = [];
  protected articleCategories: ArticleCategoryType[] = [];
  protected selectedCategories: string[] = [];

  protected currentPage: number = 1;
  protected pages: number = 1;
  private count: number = 0;

  protected dropdownOpen: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private readonly articleService: ArticleService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
  }

  public ngOnInit(): void {
    this.articleService.getArticleCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ArticleCategoryType[]): void => {
        this.articleCategories = data;
      });

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params): void => {
        const active: ActiveParamsType = ActiveParamsUtil.processParams(params);
        this.selectedCategories = active.categories || [];
        this.currentPage = active.page || 1;
        this.loadArticles();
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

 private loadArticles(): void {
    const params: ActiveParamsType = {
      categories: this.selectedCategories,
      page: this.currentPage
    };

    this.articleService.getArticles(params)
      .pipe(takeUntil(this.destroy$), debounceTime(500))
      .subscribe({
        next: (response: { count: number; pages: number; items: ArticleType[] }): void => {
          this.articles = response.items;
          this.pages = response.pages || 1;
          this.count = response.count || 0;
        },
        error: err => {
          console.error('Ошибка при загрузке статей', err);
        }
      });
  }

  protected getCategoryNameByUrl(url: string): string {
    const categoryName: ArticleCategoryType | undefined = this.articleCategories.find((x: ArticleCategoryType): boolean => x.url === url);
    return categoryName ? categoryName.name : url;
  }

  protected isSelected(categoryUrl: string): boolean {
    return this.selectedCategories.includes(categoryUrl);
  }

  protected toggleCategory(categoryUrl: string): void {
    if (this.isSelected(categoryUrl)) {
      this.selectedCategories = this.selectedCategories.filter((cat: string): boolean => cat !== categoryUrl);
    } else {
      this.selectedCategories = [...this.selectedCategories, categoryUrl];
    }

    this.currentPage = 1;
    this.updateUrl();
  }

  protected removeFilter(categoryUrl: string): void {
    this.toggleCategory(categoryUrl);
  }

  private updateUrl(): void {
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

  protected goToPage(page: number): void {
    if (page < 1 || page > this.pages || page === this.currentPage) return;
    this.currentPage = page;
    this.updateUrl();
  }

  protected prevPage(): void {
    if (this.currentPage > 1) this.goToPage(this.currentPage - 1);
  }

  protected nextPage(): void {
    if (this.currentPage < this.pages) this.goToPage(this.currentPage + 1);
  }

  protected get pagesArray(): number[] {
    return Array.from({length: this.pages}, (_, i: number) => i + 1);
  }

  protected closeDropdown(): void {
    this.dropdownOpen = false;
  }

  protected openDropdown(): void {
    this.dropdownOpen = true;
  }
}
