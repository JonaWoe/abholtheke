import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Prescription } from '../_models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  constructor(private http: HttpClient) { }

  endpointUrl = 'https://abholtheke-1.appspot.com';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  getPrescriptionsByInsuranceId(insuranceId) {
    return this.http.get<Prescription[]>(environment.endpointUrl + '/prescription/' + insuranceId , this.httpOptions);
  }

  getPrescriptionsByPharmacyId(pharmacyId) {
    return this.http.get<Prescription[]>(environment.endpointUrl + '/prescription/pharmacy/' + pharmacyId , this.httpOptions);
  }

  addPharmacy(prescriptionId, pharmacyId) {
    return this.http.post(environment.endpointUrl + '/prescription/', {prescriptionId, pharmacyId}, this.httpOptions);
  }

}
