import { Router } from '@angular/router';
import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
declare const $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string ='';
  password: string ='';

  constructor(private loginService: LoginService,private router: Router) { }

  ngOnInit(): void {
  }
  login(): void{
    // ปิด loginModal
    $('#loginModal').modal('hide');
    console.log(this.username + ' ' + this.password);
   //เรียกใช้งาน LoginService
 //this.loginService.getLogin(this.username,this.password)
   this.loginService.postLogin(this.username,this.password)
  
   .subscribe(result =>{
    //  alert(result);
    if (result.status==='ผู้ดูแลระบบ'){
      this.router.navigate(['/admin']);
    }else if(result.status === 'ผู้ใช้ระบบ'){
      this.router.navigate(['/user']);
    }else{
      alert(result.status);
    }
   })
  }

}
