import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Pharmacy } from '../_models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PharmaciesService {
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  getPharmacies() {
    return this.http.get<Pharmacy[]>(environment.endpointUrl + '/Pharmacies', this.httpOptions);
  }

}
