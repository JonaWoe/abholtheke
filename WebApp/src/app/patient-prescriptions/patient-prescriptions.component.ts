import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { Prescription, User } from '../_models';
import { PrescriptionService, AuthenticationService } from '../_services';

@Component({
  selector: 'app-prescriptions',
  templateUrl: './patient-prescriptions.component.html',
  styleUrls: ['./patient-prescriptions.component.css']
})
export class PatientPrescriptionsComponent implements OnInit, OnDestroy {
  prescriptions: Prescription[] = [];
  currentUser: User;
  currentUserSubscription: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
    private prescriptionService: PrescriptionService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.loadAllPrescriptions();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  private loadAllPrescriptions() {
    this.prescriptionService.getPrescriptionsByInsuranceId(this.currentUser.insuranceId).pipe(first()).subscribe(prescriptions => {
      this.prescriptions = prescriptions;
    });
  }

}
