import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404Component } from './error404/error404.component';
import { Error500Component } from './error500/error500.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [Error404Component, Error500Component],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path:'error404',component:Error404Component},
      {path:'error500',component:Error500Component}
    ])
  ]
})
export class ErrorModule { }
