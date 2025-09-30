import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArticleCardComponent} from "./components/article-card/article-card.component";
import {HeaderComponent} from "./layout/header/header.component";
import {FooterComponent} from "./layout/footer/footer.component";
import {LayoutComponent} from "./layout/layout.component";
import {RouterModule} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {ArticleDescriptionShortenerPipe} from './pipes/article-description-shortener.pipe';
import {ModalComponent} from './components/modal/modal.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {LoaderComponent} from './components/loader/loader.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@NgModule({
  declarations: [
    ArticleCardComponent,
    HeaderComponent,
    LayoutComponent,
    FooterComponent,
    ArticleDescriptionShortenerPipe,
    ModalComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  exports: [
    ArticleCardComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    RouterModule,
    MatMenuModule,
    MatButtonModule,
    ArticleDescriptionShortenerPipe,
    ModalComponent,
    LoaderComponent
  ]
})
export class SharedModule {
}
