import { Component, OnInit } from '@angular/core';
import { AlertService, AuthenticationService, TerminalService } from '../_services';
import { Box, User} from '../_models';
import { timer } from 'rxjs';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit {

  currentUser: User;
  cameraAvailable = true;
  doorStatus = '';
  box: Box;
  loading = false;

  constructor(
    private authenticationService: AuthenticationService,
    private terminalService: TerminalService,
    private alertService: AlertService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.authenticationService.logout();
    this.detectWebcam();
  }

  private scanSuccessHandler($event) {
    if (!this.loading) {
      this.loading = true;
      this.startProcess($event);
    }
  }

  private detectWebcam() {
    const md = navigator.mediaDevices;
    if (!md || !md.enumerateDevices) {
      this.cameraAvailable = false;
    } else {
      md.enumerateDevices().then(devices => {
        this.cameraAvailable = devices.some(device => 'videoinput' === device.kind);
      });
    }
  }

  private startProcess(prescriptionId) {
    this.terminalService.startProcess(prescriptionId).subscribe(_ => {
      const numbers = timer(0, 5000);
      numbers.subscribe(x => {
        this.getBoxesByPrescriptionId(prescriptionId);
      });

    });
  }

  private getBoxesByPrescriptionId(prescriptionId): any {
    this.terminalService.getBoxByPrescriptionId(prescriptionId).subscribe(box => {
      this.box = box;
      this.doorStatus = box.doorStatus;
      this.alertService.success('Rezept eingescanned!');
      this.loading = false;
    }, error => {
      this.doorStatus = '';
      this.alertService.error(error);
      this.loading = false;
    });
  }

}
