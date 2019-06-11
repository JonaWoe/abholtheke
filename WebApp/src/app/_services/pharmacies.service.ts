import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Pharmacies } from '../_models';

@Injectable({ providedIn: 'root' })
export class PharmaciesService {
  constructor(private http: HttpClient) { }

  endpointUrl = 'http://localhost:3000';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  getPharmacies() {
    return this.http.get<Pharmacies[]>(this.endpointUrl + '/Pharmacies', this.httpOptions);
  }

}
