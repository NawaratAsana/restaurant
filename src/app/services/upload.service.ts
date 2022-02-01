import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  url = 'http://localhost/restuarantAPI/upload.php'
  constructor(private httpClient: HttpClient) {} 

  uploadUserPictureFile(data:any): Observable<any>{
    console.log(data);   // return;
  
    return this.httpClient.post(this.url,data);
}
}
