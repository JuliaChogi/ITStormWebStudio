import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./shared/layout/layout.component";
import {MainComponent} from "./views/main/main.component";
import {ArticleComponent} from "./views/blog/article/article.component";
import {PolicyComponent} from "./views/policy/policy.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path:'', component: MainComponent},
      {path: '', loadChildren: () => import('./views/user/user.module').then(m => m.UserModule)},
      {path: 'blog', loadChildren: () => import('./views/blog/blog.module').then(m => m.BlogModule)},
      {path: 'article/:url', component: ArticleComponent},
      {path: 'policy', component: PolicyComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: "enabled"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
