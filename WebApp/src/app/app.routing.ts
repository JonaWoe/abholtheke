import { Routes, RouterModule } from '@angular/router';

import { PatientHomeComponent } from './patient-home';
import { PatientLoginComponent } from './patient-login';
import { PatientRegisterComponent } from './patient-register';
import { PatientPrescriptionsComponent} from './patient-prescriptions';
import { PatientAuthGuard } from './_guards';
import { WithGoogleComponent } from './patient-register/withGoogle';
import { PharmacistLoginComponent } from './pharmacist-login';
import { PharmacistHomeComponent } from './pharmacist-home';
import { PharmacistAuthGuard } from './_guards';
import { PharmacistPrescriptionComponent } from './pharmacist-prescription';

const appRoutes: Routes = [
  { path: 'patient', component: PatientHomeComponent, canActivate: [PatientAuthGuard] },
  { path: 'patient/login', component: PatientLoginComponent },
  { path: 'patient/register', component: PatientRegisterComponent },
  { path: 'patient/register/google', component: WithGoogleComponent },
  { path: 'patient/prescriptions', component: PatientPrescriptionsComponent, canActivate: [PatientAuthGuard]},
  { path: 'pharmacist', component: PharmacistHomeComponent, canActivate: [PharmacistAuthGuard] },
  { path: 'pharmacist/login', component: PharmacistLoginComponent },
  { path: 'pharmacist/prescriptions', component: PharmacistPrescriptionComponent },


  // otherwise redirect to patientLogin
  { path: '**', redirectTo: 'patient/login' }
];

export const routing = RouterModule.forRoot(appRoutes);

