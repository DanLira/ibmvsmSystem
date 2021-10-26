import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './guards/auth.guard';
import { CadMembroComponent } from './cadMembro/cadMembro.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

{
    path: 'home',
    component: HomeComponent,
    //canActivate: [AuthGuard]
},

{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [AuthGuard]
},

{
    path: 'login',
    component: LoginComponent
},

{
  path: 'usuario',
  component: UserComponent
},
{
  path: 'membro',
  component: CadMembroComponent
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
