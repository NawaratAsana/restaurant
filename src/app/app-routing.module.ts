import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ProductComponent } from './admin/product/product.component';
import { StatusComponent } from './admin/status/status.component';
import { UsersComponent } from './admin/users/users.component';
import { AdminComponent } from './admin/admin.component';
import { SlideComponent } from './site/slide/slide.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './site/about/about.component';
import { ProfileComponent } from './site/profile/profile.component';
import { SiteComponent } from './site/site.component';

const routes: Routes = [
  {
    path: '',
    component: SiteComponent,
    children: [
      { path: '', component: SlideComponent },
      { path: 'about', component: AboutComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'slide', component: SlideComponent },
    ]
  },
  {
    path:'',component:AdminComponent,
    children:[
      {path:'admin',component:DashboardComponent},
      {path:'users',component:UsersComponent},
      {path:'status',component:StatusComponent},
      {path:'product',component:ProductComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
