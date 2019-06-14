import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import {Pharmacies, Prescription, User} from '../../_models';
import { PrescriptionService, PharmaciesService, AuthenticationService, AlertService } from '../../_services';

@Component({
  selector: 'app-pharmacy-modal',
  templateUrl: './choosePharmacy.modal.html',
  styleUrls: ['./choosePharmacy.modal.css']
})
// tslint:disable-next-line:component-class-suffix
export class ChoosePharmacyModal implements OnInit, OnDestroy {
  closeResult: string;
  pharmacies: Pharmacies[] = [];
  currentUser: User;
  currentUserSubscription: Subscription;
  @Input() prescription: Prescription;

  constructor(
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private pharmaciesService: PharmaciesService,
    private prescriptionService: PrescriptionService,
    private alertService: AlertService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.loadAllPharmacies();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  private loadAllPharmacies() {
    this.pharmaciesService.getPharmacies().pipe(first()).subscribe(pharmacies => {
      this.pharmacies = pharmacies;
    });
  }

  // for more info see https://ng-bootstrap.github.io/#/components/modal/examples

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private choosePharmacy(pharmacy, modal) {
    this.prescriptionService.addPharmacy(this.prescription._id, pharmacy._id)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Apotheke erfolgreich ausgewählt!', true);
          this.prescription.pharmacyId = pharmacy._id;
          modal.dismiss();
        },
        error => {
          this.alertService.error('Apothekenauswahl fehlgeschlagen!');
          modal.dismiss();
        });
  }
}
