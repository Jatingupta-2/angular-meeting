import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import{AppService} from '../app.service';
import { RouterModule } from '@angular/router';
import { ChangepassComponent } from './changepass/changepass.component';

@NgModule({
  declarations: [SignupComponent, LoginComponent, ChangepassComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path:'signup',component:SignupComponent},
      {path:'changePass',component:ChangepassComponent}
    ])
  ]
})
export class UserModule { }
