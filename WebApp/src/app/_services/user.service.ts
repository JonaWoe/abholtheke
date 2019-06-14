import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  endpointUrl = 'http://localhost:3000';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  register(user) {
    return this.http.post(this.endpointUrl + `/users`, user, this.httpOptions);
  }

}
