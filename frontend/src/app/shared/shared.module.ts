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


@NgModule({
  declarations: [
    ArticleCardComponent,
    HeaderComponent,
    LayoutComponent,
    FooterComponent,
    ArticleDescriptionShortenerPipe,
    ModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatButtonModule,
    ReactiveFormsModule,

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
    ModalComponent
  ]
})
export class SharedModule {
}
