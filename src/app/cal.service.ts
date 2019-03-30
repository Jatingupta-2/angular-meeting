import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';

import 'rxjs/add/operator/do'
import 'rxjs/add/operator/catch';
import {HttpClient,HttpHeaders,HttpParams,HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CalService {

  private url='http://localhost:3000';
  constructor(private http:HttpClient) { }

  public addEvent=(data):Observable<any>=>{
    const p = new HttpParams()
    .set('receiverId',data.receiverId)
    .set('start',data.start)
    .set('end',data.end)
    .set('title',data.title)
    .set('color',data.color)
    .set('allDay',data.allDay)
    .set('resizable',data.resizable)
    .set('draggable',data.draggable)
    .set('where',data.where)
    .set('purpose',data.purpose)
    .set('lastUpdatedBy',data.lastUpdatedBy)

    return this.http.post(`${this.url}/api/v1/events/add`,p);
  }

  public viewEvent=(receiverId):Observable<any>=>{
    return this.http.get(this.url+"/api/v1/events/view/all/"+receiverId);
  }


  public deleteEvent=(eventId):Observable<any>=>{
    
    return this.http.post(this.url+"/api/v1/events/delete/"+eventId,"")

  }
  public editEvent=(event):Observable<any>=>{
    
    return this.http.put(this.url+"/api/v1/events/edit/"+event.eventId,event)

  }


  public editmail=(data):Observable<any>=>{
    const p= new HttpParams()
    .set('email',data.email)
    .set('subject',data.subject)
    .set('text',data.text)

    return(this.http.post(`${this.url}/api/v1/events/editmail`,p))


  }

}
