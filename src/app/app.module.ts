import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './site/navbar/navbar.component';
import { SlideComponent } from './site/slide/slide.component';
import { LoginComponent } from './site/login/login.component';
import { RegisterComponent } from './site/register/register.component';
import { FooterComponent } from './site/footer/footer.component';
import { ProfileComponent } from './site/profile/profile.component';
import { AboutComponent } from './site/about/about.component';
import { SiteComponent } from './site/site.component';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { StatusComponent } from './admin/status/status.component';
import { UsersComponent } from './admin/users/users.component';
import { ProductComponent } from './admin/product/product.component';
import { DashboardNavbarComponent } from './admin/dashboard-navbar/dashboard-navbar.component';
import { DashboardSidebarComponent } from './admin/dashboard-sidebar/dashboard-sidebar.component';
import { DashboardFooterComponent } from './admin/dashboard-footer/dashboard-footer.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SlideComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    ProfileComponent,
    AboutComponent,
    SiteComponent,
    AdminComponent,
    DashboardComponent,
    StatusComponent,
    UsersComponent,
    ProductComponent,
    DashboardNavbarComponent,
    DashboardSidebarComponent,
    DashboardFooterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
