import { UserService } from './../../services/user.service';
import { HttpClient } from '@angular/common/http';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public items: any;
  
  constructor(private userService:UserService) { }

  ngOnInit(): void {
    //เรียกใช้งาน userservice เพื่อ get ข้อมูล
   this.userService.getUser()
    .subscribe(result =>{
      this.items = result;
      console.log(this.items);
    });
  }

}
