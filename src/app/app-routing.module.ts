import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { TradeAccountComponent } from './trade-account/trade-account.component';


const routes: Routes = [
  // { 
  //   path: '',   
  //   redirectTo: '/trade-account', 
  //   pathMatch: 'full' 
  // },
  {
    path: '',
    component: TradeAccountComponent,
    data: { }
  },
  {
    path: ':wid',
    component: TradeAccountComponent,
    data: { }
  },
  {
    path: 'trade-account',
    component: TradeAccountComponent,
    data: { }
  },

  {
    path: "new/:wid/:contact_type_id",
    component: RegistrationComponent,
    data: { }
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
