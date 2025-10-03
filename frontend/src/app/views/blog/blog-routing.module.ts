import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CatalogComponent} from "./catalog";
import {ArticleComponent} from "./article";


const routes: Routes = [
  {path: 'blog', component: CatalogComponent},
  {path: 'article/:url', component: ArticleComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule {
}
