import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './site/navbar/navbar.component';
import { SlideComponent } from './site/slide/slide.component';
import { LoginComponent } from './site/login/login.component';
import { RegisterComponent } from './site/register/register.component';
import { FooterComponent } from './site/footer/footer.component';
import { ProfileComponent } from './site/profile/profile.component';
import { AboutComponent } from './site/about/about.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SlideComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    ProfileComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
