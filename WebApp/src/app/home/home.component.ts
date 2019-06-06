import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { Prescription, User } from '../_models';
import { PrescriptionService, AuthenticationService } from '../_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: User;
  currentUserSubscription: Subscription;
  prescriptions: Prescription[] = [];

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

  deleteUser(id) {
    /*this.userService.delete(id).pipe(first()).subscribe(() => {
      this.loadAllPrescriptions();
    });*/
  }

  private loadAllPrescriptions() {
    this.prescriptionService.getPrescriptionsByInsuranceId(this.currentUser.insuranceId).pipe(first()).subscribe(prescriptions => {
      this.prescriptions = prescriptions;
    });
  }
}
