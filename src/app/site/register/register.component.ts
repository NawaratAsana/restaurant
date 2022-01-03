import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
declare const $: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  //ประกาศตัวแปรแบบ object เพื่อใช้ bind ข้อมูลในฟอร์มลงทะเบียนสมัครสมาชิก
  model = {
    name: '',
    gender: '',
    address: '',
    telephone: '',
    email: '',
    username: '',
    password: '',
    statusid: '',
  };
  constructor(private userService: UserService) {}

  ngOnInit(): void {}
  register(): void {
    //ปิด modal
    $('#registerModal').modal('hide');
    this.model.statusid = '2'; //2 คือ ผู้ใช้งาน
    // console.log(this.model);
    //เรียกใช้ user service เพื่อ post ข้อมูล
    this.userService.postUser(this.model)
    .subscribe((result) => {
      // console.log(result);
      alert(result.status);
    });
  }
}
