import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogRoutingModule } from './blog-routing.module';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {CatalogComponent} from "./catalog";
import {ArticleComponent} from "./article";
import {SharedModule} from "../../shared";


@NgModule({
  declarations: [
    CatalogComponent,
    ArticleComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    BlogRoutingModule
  ],
  exports: [
    ArticleComponent
  ]
})
export class BlogModule { }
