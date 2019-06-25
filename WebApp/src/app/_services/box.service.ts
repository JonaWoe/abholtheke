import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Box } from '../_models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BoxService {
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  getBoxByPharmacyIdAndBoxNumber(pharmacyId, boxNumber) {
    return this.http.get<Box>(environment.endpointUrl + '/boxes/' + pharmacyId + '/' + boxNumber, this.httpOptions);
  }

  getBoxesByPharmacyId(pharmacyId) {
    return this.http.get<Box[]>(environment.endpointUrl + '/boxes/' + pharmacyId, this.httpOptions);
  }

  updateBoxPrescriptionId(boxId, prescriptionId) {
    return this.http.post(environment.endpointUrl + `/boxes/prescription`, {boxId, prescriptionId}, this.httpOptions);
  }

}
