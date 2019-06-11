import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { Pharmacies, User } from '../../_models';
import { PharmaciesService, AuthenticationService } from '../../_services';

@Component({
  selector: 'app-pharmacy-modal',
  templateUrl: './choosePharmacy.modal.html'
})
// tslint:disable-next-line:component-class-suffix
export class ChoosePharmacyModal implements OnInit, OnDestroy {
  closeResult: string;
  pharmacies: Pharmacies[] = [];
  currentUser: User;
  currentUserSubscription: Subscription;

  constructor(
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private pharmaciesService: PharmaciesService
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
}
