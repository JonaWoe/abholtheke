import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, LoginOpt} from 'angularx-social-login';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';




import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { AlertComponent } from './_components';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register/';
import { PrescriptionsComponent } from './prescriptions/prescriptions.component';
import { ChoosePharmacyModal} from './prescriptions/choosePharmacy/choosePharmacy.modal';


const googleLoginOptions: LoginOpt = {
  scope: 'profile email openid'
};
const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('17332753239-jkjc9kcut7esa71cr7ue14a6uqr8v5ir', googleLoginOptions)
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing,
    SocialLoginModule,
    NgbModule
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    PrescriptionsComponent,
    ChoosePharmacyModal
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: AuthServiceConfig, useFactory: provideConfig}
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
