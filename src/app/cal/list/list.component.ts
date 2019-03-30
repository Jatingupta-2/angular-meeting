import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {Cookie} from 'ng2-cookies/ng2-cookies'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(private apps:AppService,private toastr:ToastrService,private router:Router) { }
public users=[];
public userName;
 
  ngOnInit() {

    this.verifyToken();

    setInterval(() => {
      this.verifyToken();
  }, 1000);

    this.apps.getAllUsers().subscribe(
      (apiResponse)=>{
        this.users=apiResponse.data;
        
        this.userName=this.apps.getUserInfo().userName
      },
      (error)=>{
        this.toastr.error("Some Error Occurred "+error);
            setTimeout(()=>{
              this.router.navigate(['/error404']);
            },2000) ;
      }        
    )

    
  
  }
  verifyToken():void{
    if(Cookie.get('authToken')==null||Cookie.get('authToken')==''||!Cookie.get('authToken'))
    {this.router.navigate(['/'])}
    if(Cookie.get('receiverId')==null||Cookie.get('receiverId')==''||!Cookie.get('receiverId'))
    {this.router.navigate(['/'])}
  }

  public cal=(user)=>{
    Cookie.set('email',user.email);
    Cookie.set('receiverId', user.userId);
    this.router.navigate(['/calendar'])

  }

  logout(){
    this.apps.logout()
    Cookie.delete('authToken')
    Cookie.delete('receiverId')
    Cookie.delete('receiverName')
    this.apps.setUserInfo('')
    this.router.navigate([''])
  }


}
