import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../app.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private toastr: ToastrService, private apps: AppService, private router: Router) { }

  ngOnInit() {
  }

  public signin = () => {
    this.router.navigate(['/']);

  }

  public firstName: any;
  public lastName: any;
  public mobile: any;
  public email: any;
  public countryCode: any;
  public password: any;
  public admin: boolean;


  public signup: any = () => {
    if (!this.firstName) {
      this.toastr.warning('Please Enter First Name');
    }
    else if (!this.lastName) {
      this.toastr.warning('Please Enter Last Name');
    }
    else if (!this.mobile) {
      this.toastr.warning('Please Enter Mobile');
    }
    else if (!this.email) {
      this.toastr.warning('Please Enter email');
    }
    else if (!this.countryCode) {
      this.toastr.warning('Please Enter Country Code');
    }
    else if (!this.password) {
      this.toastr.warning('Please Enter password');
    }
    else if(this.admin===undefined||this.admin===null){
      this.admin=false;
    }

    else {
      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobile: this.mobile,
        email: this.email,
        password: this.password,
        countryCode: this.countryCode,
        admin: this.admin
      }
console.log(data);
      this.apps.signup(data).subscribe(

        (apiResponse) => {

          if (apiResponse.status == 200) {
            this.toastr.success("SignUp Successful" + " " + apiResponse.data.userName)
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);
          }
          else {
            this.toastr.error("Sign Up Failed" + apiResponse.message);
            setTimeout(() => {
              this.router.navigate(['/error500']);
            }, 2000);

          }
        }, (error) => {
          this.toastr.error("Some Error Occurred" + error);
          setTimeout(() => {
            this.router.navigate(['/error404']);
          }, 2000);
        }
      )
    }
  }

}
