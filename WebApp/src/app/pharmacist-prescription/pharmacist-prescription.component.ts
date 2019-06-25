import { Component, OnInit } from '@angular/core';
import { PrescriptionService, BoxService, AuthenticationService, AlertService } from '../_services';
import { Box, Pharmacist, Prescription } from '../_models';
import { Subscription } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'app-pharmacist-prescription',
  templateUrl: './pharmacist-prescription.component.html',
  styleUrls: ['./pharmacist-prescription.component.css']
})
export class PharmacistPrescriptionComponent implements OnInit {

  prescriptions: Prescription[] = [];
  boxes: Box[] = [];
  currentUser: Pharmacist;
  currentUserSubscription: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
    private prescriptionService: PrescriptionService,
    private alertService: AlertService,
    private boxService: BoxService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = (user as unknown as Pharmacist);
    });
  }

  ngOnInit() {
    this.loadAllPrescriptions();
    this.loadAllBoxes();
  }

  private loadAllPrescriptions() {
    this.prescriptionService.getPrescriptionsByPharmacyId(this.currentUser.pharmacyId).pipe(first()).subscribe(prescriptions => {
      this.prescriptions = prescriptions;
      console.log(this.prescriptions);
    });
  }

  private loadAllBoxes() {
    this.boxService.getBoxesByPharmacyId(this.currentUser.pharmacyId).pipe(first()).subscribe(boxes => {
      this.boxes = boxes;
    });
  }

  private updateBoxPrescriptionId(boxId, prescriptionId) {
    this.boxService.updateBoxPrescriptionId(boxId, prescriptionId).subscribe(data => {
        this.alertService.success('Änderung gespeichert!');
      },
      error => {
        this.alertService.error(error);
      });
  }

  private getFormatedDate(date)  {
    return new Date(date).toLocaleString();
  }

}

