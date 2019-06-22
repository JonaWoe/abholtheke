import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { PatientLoginComponent } from './patient-login';
import { RegisterComponent } from './register';
import { PrescriptionsComponent} from './prescriptions';
import { PatientAuthGuard } from './_guards';
import { WithGoogleComponent } from './register/withGoogle';
import { PharmacistLoginComponent } from './pharmacist-login';
import { PharmacyComponent } from './pharmacy';
import { PharmacistAuthGuard } from './_guards';


const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [PatientAuthGuard] },
  { path: 'login', component: PatientLoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register/google', component: WithGoogleComponent },
  { path: 'prescriptions', component: PrescriptionsComponent, canActivate: [PatientAuthGuard]},
  { path: 'pharmacy/login', component: PharmacistLoginComponent },
  { path: 'pharmacy', component: PharmacyComponent, canActivate: [PharmacistAuthGuard] },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
