import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalComponent } from './cal/cal.component';
import{RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import '../../../node_modules/flatpickr/dist/flatpickr.css'; 
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ListComponent } from './list/list.component';
import { CalUserComponent } from './cal-user/cal-user.component';


@NgModule({
  declarations: [CalComponent, ListComponent, CalUserComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide:DateAdapter,
      useFactory:adapterFactory
    }),
    RouterModule.forChild([
      {path:'calendar',component:CalComponent},
      {path:'user',component:CalUserComponent},
      {path:'list',component:ListComponent}
    ])
  ],
  exports:[CalComponent]
})
export class CalModule { }
