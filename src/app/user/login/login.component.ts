import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router:Router,private apps:AppService,private toastr:ToastrService) { }

  ngOnInit() {
    
  }



  public email:any;
  public password:any;


  public signup=()=>{
    this.router.navigate(['/signup']);
  }

  public forgotpassword=()=>{
    if(!this.email){
      this.toastr.warning("Please enter Email")
    }
    let email=this.email

    this.apps.forgotPassword(email).subscribe(
      (apiResponse)=>{
        this.toastr.warning("Please check your Mail!!!")
      },
      (error)=>{
        this.toastr.error("Some Error Occurred "+error);
            setTimeout(()=>{
              this.router.navigate(['/error404']);
            },2000) ;
      }
    )

  }

  public signin:any=()=>{
    if (!this.email) {
      this.toastr.warning("Please Enter Email");
    }
    if (!this.password) {
      this.toastr.warning("Please Enter Password");
    }
    else {
      let data = {
        email: this.email,
        password: this.password
      }
    this.apps.signin(data).subscribe(
      (apiResponse)=>{

        if(apiResponse.status==200){
          console.log(apiResponse);
          Cookie.set('authToken', apiResponse.data.authToken);
          Cookie.set('receiverId', apiResponse.data.userDetails.userId);
          Cookie.set('receiverName', `${apiResponse.data.userDetails.firstName} ${apiResponse.data.userDetails.lastName}`);
          
          this.apps.setUserInfo(apiResponse.data.userDetails);
          this.toastr.success("Successfully Logged In "+`${apiResponse.data.userDetails.firstName} ${apiResponse.data.userDetails.lastName}`);
          if(apiResponse.data.userDetails.admin==true){this.router.navigate(['/list']);}
          else{
            this.router.navigate(['/user'])
          }
          
        }
        else{
          console.log(apiResponse);
          this.toastr.error("Sign Up Failed "+apiResponse.message);
              setTimeout(()=>{
                this.router.navigate(['/error500']);
              },2000) ;
        }
      },
      (error)=>{
        this.toastr.error("Some Error Occurred "+error);
            setTimeout(()=>{
              this.router.navigate(['/error404']);
            },2000) ;
      }
    )
    
    }
  }

  public loginUsingKeyPress:any=(event:any)=>{
    if(event.keyCode===13){
      this.signin();
    }
  }

}
