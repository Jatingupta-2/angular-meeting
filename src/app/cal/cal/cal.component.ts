
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  getHours,
  getDate,
  getDay,
  format,
  startOfMinute
} from 'date-fns';

import { Subject } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction, CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { CalService } from '../../cal.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Options } from 'selenium-webdriver/chrome';
import { AppService } from '../../app.service';
export interface someEvent extends CalendarEvent {
  eventId?: string;
  where?:String;
  purpose?:String;
  lastUpdatedBy?:string
}

const colors: any = {
  red:
    '#ad2121'

  ,
  blue: '#1e90ff',

  yellow: '#e3bc08'

};

@Component({
  selector: 'app-cal',
  templateUrl: './cal.component.html',
  styleUrls: ['./cal.component.css']
})

export class CalComponent {
  

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: someEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: someEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: someEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();


  events: someEvent[] =
    [
      // {

        
      //   start: subDays(startOfDay(new Date()), 1),
      //   end: addDays(new Date(), 1),
      //   title: 'A 3 day event',
      //   color: colors.red,
      //   actions: this.actions,
      //   allDay: true,
      //   resizable: {
      //     beforeStart: true,
      //     afterEnd: true
      //   },
      //   draggable: true
      // }
      // {start: startOfDay(new Date()),
      //   title: 'An event with no end date',
      //   color: colors.yellow,
      //   actions: this.actions
      // },
      // {
      //   start: subDays(endOfMonth(new Date()), 3),
      //   end: addDays(endOfMonth(new Date()), 3),
      //   title: 'A long event that spans 2 months',
      //   color: colors.blue,
      //   allDay: true
      // },
      // {
      //   start: addHours(startOfDay(new Date()), 2),
      //   end: new Date(),
      //   title: 'A draggable and resizable event',
      //   color: colors.yellow,
      //   actions: this.actions,
      //   resizable: {
      //     beforeStart: true,
      //     afterEnd: true
      //   },
      //   draggable: true
      // }
    ];
  activeDayIsOpen: boolean = true;
  public userName;

  constructor(private modal: NgbModal,private apps:AppService, private cal: CalService, private toastr: ToastrService, private router: Router) {



  }
  public name;
 

  ngOnInit() {

this.verifyToken();

    this.userName=this.apps.getUserInfo().userName
    
    setInterval(() => {
      this.verifyToken();
  }, 1000);
  
    this.cal.viewEvent(Cookie.get('receiverId')).subscribe(
      
      (apiResponse) => {
        if (apiResponse.status == 200) {
          console.log(apiResponse.data)
          
          for (let i = 0; i < apiResponse.data.length; i++) {

            
            
            //Mon Oct 6 2014 00:00:00
            this.events = [
              ...this.events,
              {
                title: apiResponse.data[i].title,
                start: startOfMinute(apiResponse.data[i].start),
                end: apiResponse.data[i].end,
                color: apiResponse.data[i].color,
                draggable: apiResponse.data[i].draggable,
                resizable: apiResponse.data[i].resizable,
                eventId:apiResponse.data[i].eventId,
                where:apiResponse.data[i].where,
                purpose:apiResponse.data[i].purpose,
                lastUpdatedBy:apiResponse.data[i].lastUpdatedBy
              }
            ];
          }
        
          
        }
        else {
          this.events = [];
          console.log("No events Found")
        }
      },
      (error) => {
        this.toastr.error("Some Error Occurred " + error);
        setTimeout(() => {
          this.router.navigate(['/error404']);
        }, 2000);
      }
    )
  }

  dayClicked({ date, events }: { date: Date; events: someEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }


  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: someEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {

    var newEvent = {
      receiverId: Cookie.get('receiverId'),
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.blue,
      draggable: true,
      where:'Meeting Room 1',
      purpose:'General Discussion',
      lastUpdatedBy:this.apps.getUserInfo().userName,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
      

    }
    this.events = [
      ...this.events,
      newEvent
    ];



    this.cal.addEvent(newEvent).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 200) {

          this.toastr.success("Event added Successfully")
          console.log(apiResponse);
          newEvent["eventId"] = apiResponse.data.eventId;
          console.log(newEvent)



          
            if(!Cookie.get('email')){
              this.toastr.warning("Email details Not Found. Email not sent")
            }
          
        
            let data={
              email:Cookie.get('email'),
              subject:"Meeting Added By admin",
              text:`A new Meeting is added by Admin(${this.apps.getUserInfo().userName})`
              
            }
            this.cal.editmail(data).subscribe(
              (apiResponse)=>{
                this.toastr.success("Mail sent successfully!!")
              },
              (error)=>{
                this.toastr.error("Some Error Occurred "+error);
                    setTimeout(()=>{
                      this.router.navigate(['/error404']);
                    },2000) ;
              }
            )
        
          



        }
        else {
          this.toastr.error("Cannot add event")
        }

      },
      (error) => {
        this.toastr.error("Some Error Occurred " + error);
        setTimeout(() => {
          this.router.navigate(['/error404']);
        }, 2000);
      }
    )
  }
  public newPassword:any;

  editPassword(){
    
    this.router.navigate(['/changePass'])
  }

  verifyToken():void{

    if(Cookie.get('authToken')==null||Cookie.get('authToken')==''||!Cookie.get('authToken'))
    {this.router.navigate(['/'])}
    if(Cookie.get('receiverId')==null||Cookie.get('receiverId')==''||!Cookie.get('receiverId'))
    {this.router.navigate(['/'])}
  }

  logout(){
    this.apps.logout()
    Cookie.delete('authToken')
    Cookie.delete('receiverId')
    Cookie.delete('receiverName')
    this.apps.setUserInfo('')
    this.router.navigate([''])
  }

  deleteEvent(event) {


    this.events = this.events.filter(event1 => event1 !== event);
    this.cal.deleteEvent(event.eventId).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 200) {
          this.toastr.success("Event Deleted Successfully")
          console.log(apiResponse);

          if(!Cookie.get('email')){
            this.toastr.warning("Email details Not Found. Email not sent")
          }
        
      
          let data={
            email:Cookie.get('email'),
            subject:"Meeting Deleted By admin",
            text:`Meeting - "${event.title}" is deleted by Admin(${this.apps.getUserInfo().userName})`
            
          }
          this.cal.editmail(data).subscribe(
            (apiResponse)=>{
              this.toastr.success("Mail sent successfully!!")
            },
            (error)=>{
              this.toastr.error("Some Error Occurred "+error);
                  setTimeout(()=>{
                    this.router.navigate(['/error404']);
                  },2000) ;
            }
          )


        }
        else {
          this.toastr.error("Cannot Delete event")
        }

      },
      (error) => {
        this.toastr.error("Some Error Occurred " + error);
        setTimeout(() => {
          this.router.navigate(['/error404']);
        }, 2000);
      }
    )

  }




  editEvent(event) {


    // for(let i=0;i<this.events.length;i++){
    //   if(this.events[i].eventId==event.eventId){

    //   }

    // }
    console.log(event)
    this.cal.editEvent(event).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 200) {
          this.toastr.success("Event Edited Successfully")
          console.log(apiResponse);

          if(!Cookie.get('email')){
            this.toastr.warning("Email details Not Found. Email not sent")
          }
        
      
          let data={
            email:Cookie.get('email'),
            subject:"Meeting Edited By admin",
            text:`Meeting - "${event.title}" is edited by Admin(${this.apps.getUserInfo().userName})`
            
          }
          this.cal.editmail(data).subscribe(
            (apiResponse)=>{
              this.toastr.success("Mail sent successfully!!")
            },
            (error)=>{
              this.toastr.error("Some Error Occurred "+error);
                  setTimeout(()=>{
                    this.router.navigate(['/error404']);
                  },2000) ;
            }
          )


        }
        else {
          this.toastr.error("Cannot Edit event")
        }

      },
      (error) => {
        this.toastr.error("Some Error Occurred " + error);
        setTimeout(() => {
          this.router.navigate(['/error404']);
        }, 2000);
      }
    )

  }

  

  setView(view: CalendarView) {
    this.view = view;
  }
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }



}
