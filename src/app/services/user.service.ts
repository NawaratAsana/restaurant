import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = 'http://localhost/restuarantAPI/user.php'

  constructor(private httpClient:HttpClient) { }
  // สร้างเมธอดสำหรับ CRUD Operation
  public getUser():Observable<any>{
    return this.httpClient.get(this.url);

  }
  //สร้างเมธอดสำหรับ post ข้อมูล user

  public postUser(model:any): Observable<any>{
    console.log(model);
    return this.httpClient.post(this.url,model);
  }
  //สร้างเมธอดสำหรับลบข้อมูล
  public deleteUser(userid: string): Observable<any>{
    return this.httpClient.delete(this.url +'?userid=' + userid);
  }
  //สร้างเมธอดสำหรับแก้ไขข้อมูล
  public putUser(model: any): Observable<any>{
return this.httpClient.put(this.url,model);
}  }