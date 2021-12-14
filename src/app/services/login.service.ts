import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  url = 'http://localhost/restuarantAPI/login.php';
  constructor(private httpClient: HttpClient) {}
  public getLogin(username: string, password: string): Observable<any> {
    return this.httpClient.get(
      this.url + '?username=' + username + '&password=' + password
    );
  }
}
