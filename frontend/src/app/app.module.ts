import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MainComponent} from './views/main/main.component';
import {MatMenuModule} from "@angular/material/menu";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./core/auth/auth.interceptor";
import {CarouselModule} from "ngx-owl-carousel-o";
import {SharedModule} from "./shared/shared.module";
import {CommonModule} from "@angular/common";
import { PolicyComponent } from './views/policy/policy.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    PolicyComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    SharedModule,
    CarouselModule,
    HttpClientModule,
    AppRoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatSnackBarModule,
    BrowserAnimationsModule,

  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
