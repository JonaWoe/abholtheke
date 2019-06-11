import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register/register.component';
import { PrescriptionsComponent} from './prescriptions/prescriptions.component';
import { AuthGuard } from './_guards';
import { WithGoogleComponent } from './register/withGoogle/withGoogle.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register/google', component: WithGoogleComponent },
  { path: 'prescriptions', component: PrescriptionsComponent},

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
