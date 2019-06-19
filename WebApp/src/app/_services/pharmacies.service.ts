import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Pharmacies } from '../_models';
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
    return this.http.get<Pharmacies[]>(environment.endpointUrl + '/Pharmacies', this.httpOptions);
  }

}
