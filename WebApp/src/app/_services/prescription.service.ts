import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Prescription } from '../_models';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  constructor(private http: HttpClient) { }

  endpointUrl = 'http://localhost:3000';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  getPrescriptionsByInsuranceId(insuranceId) {
    return this.http.get<Prescription[]>(this.endpointUrl + '/prescription/' + insuranceId , this.httpOptions);
  }

}
