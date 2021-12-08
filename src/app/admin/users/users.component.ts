import { HttpClient } from '@angular/common/http';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public items: any;
  constructor(private httpclient : HttpClient) { }

  ngOnInit(): void {
    //เรียกใช้งาน api เพื่อ get
    this.httpclient.get('http://localhost//restuarantAPI/user.php')
    .subscribe(result =>{
      this.items = result;
      console.log(this.items);
    });
  }

}
