import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, LoginOpt} from 'angularx-social-login';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { AlertComponent } from './_components';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { PatientHomeComponent } from './patient-home';
import { PatientLoginComponent } from './patient-login';
import { PatientRegisterComponent } from './patient-register/';
import { PatientPrescriptionsComponent } from './patient-prescriptions';
import { ChoosePharmacyModal} from './patient-prescriptions/choosePharmacy.modal/choosePharmacy.modal';
import { WithGoogleComponent } from './patient-register/withGoogle';
import { PharmacistLoginComponent } from './pharmacist-login';
import { PharmacistHomeComponent } from './pharmacist-home';
import { PharmacistPrescriptionComponent } from './pharmacist-prescription';
import { ChooseBoxModal } from './pharmacist-prescription/chooseBox.modal/chooseBox.modal';
import { TerminalComponent } from './terminal/terminal.component';


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
    ZXingScannerModule,
    NgbModule
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    PatientHomeComponent,
    PatientLoginComponent,
    PatientRegisterComponent,
    PatientPrescriptionsComponent,
    ChoosePharmacyModal,
    WithGoogleComponent,
    PharmacistLoginComponent,
    PharmacistHomeComponent,
    PharmacistPrescriptionComponent,
    ChooseBoxModal,
    TerminalComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: AuthServiceConfig, useFactory: provideConfig}
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
