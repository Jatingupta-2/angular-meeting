import { Injectable } from '@angular/core';
import{Observable} from 'rxjs';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {HttpClient,HttpHeaders,HttpParams,HttpErrorResponse} from '@angular/common/http';
 


@Injectable({
  providedIn: 'root'
})
export class AppService {

  private url='http://api.jatingupta.xyz';
  constructor(private http:HttpClient) { }

  public signup=(data):Observable<any>=>{
    const p=new HttpParams()
    .set('firstName',data.firstName)
    .set('lastName',data.lastName)
    .set('mobile',data.mobile)
    .set('email',data.email)
    .set('password',data.password)
    .set('countryCode',data.countryCode)
    .set('admin',data.admin)
    

    return this.http.post(`${this.url}/api/v1/users/signup`,p);
  }


  public signin=(data):Observable<any>=>{
    const p = new HttpParams()
    .set('email',data.email)
    .set('password',data.password)
     return this.http.post(`${this.url}/api/v1/users/login`,p);
  }

  public getUserInfo=()=>{
    return JSON.parse(localStorage.getItem('UserInfo'));
  }

  public setUserInfo=(data)=>{
    localStorage.setItem('UserInfo',JSON.stringify(data))
  }

  public logout=():Observable<any>=>{
    const p= new HttpParams()
    .set('authToken',Cookie.get('authToken'))

    return this.http.post(`${this.url}/api/v1/users/logout`,p);
  }


  public forgotPassword=(data):Observable<any>=>{
    const p= new HttpParams()
    .set('email',data)

    return(this.http.post(`${this.url}/api/v1/events/mail`,p))


  }


  public editPassword=(data):Observable<any>=>{
    const p= new HttpParams()
    .set('password',data.password)

    return(this.http.post(`${this.url}/api/v1/users/editPassword/${data.email}`,p))

  }

  public getAllUsers=():Observable<any>=>{
    
    return (this.http.get(`${this.url}/api/v1/users/view/all`))
  }
}
