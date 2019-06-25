import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import {Box, Pharmacist, Prescription} from '../../_models';
import {PrescriptionService, AuthenticationService, AlertService, BoxService} from '../../_services';

@Component({
  selector: 'app-box-modal',
  templateUrl: './chooseBox.modal.html',
  styleUrls: ['./chooseBox.modal.css']
})
// tslint:disable-next-line:component-class-suffix
export class ChooseBoxModal implements OnInit, OnDestroy {
  closeResult: string;
  boxes: Box[] = [];
  currentUser: Pharmacist;
  currentUserSubscription: Subscription;
  @Input() prescription: Prescription;

  constructor(
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private boxService: BoxService,
    private prescriptionService: PrescriptionService,
    private alertService: AlertService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = (user as unknown as Pharmacist);
    });
  }

  ngOnInit() {
    this.loadAllBoxes();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  private loadAllBoxes() {
    this.boxService.getBoxesByPharmacyId(this.currentUser.pharmacyId).pipe(first()).subscribe(boxes => {
      this.boxes = boxes;
    });
  }

  // for more info see https://ng-bootstrap.github.io/#/components/modal/examples

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'box-modal-basic-title' }).result.then((result) => {
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
