import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Box } from '../_models';

@Injectable({ providedIn: 'root' })
export class TerminalService {
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  startProcess(prescriptionId) {
    return this.http.post(environment.endpointUrl + '/terminals/startProcess/' + prescriptionId, this.httpOptions);
  }

  getBoxesByPrescriptionId(prescriptionId) {
    return this.http.get<Box>(environment.endpointUrl + '/terminals/' + prescriptionId, this.httpOptions);
  }

}
