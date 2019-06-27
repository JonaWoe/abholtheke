import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { first, flatMap, tap } from 'rxjs/operators';

import { NgbModal} from '@ng-bootstrap/ng-bootstrap';

import { Box, Pharmacist, Prescription } from '../../_models';
import { PrescriptionService, AuthenticationService, AlertService, BoxService } from '../../_services';

@Component({
  selector: 'app-box-modal',
  templateUrl: './chooseBox.modal.html',
  styleUrls: ['./chooseBox.modal.css']
})
// tslint:disable-next-line:component-class-suffix
export class ChooseBoxModal implements OnInit, OnDestroy {

  boxes: Box[] = [];
  box: Box;
  currentUser: Pharmacist;
  currentUserSubscription: Subscription;
  @Input() prescription: Prescription;
  cameraAvailable = true;

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
    this.detectWebcam();
  }


  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }

  private loadAllBoxes() {
    this.boxService.getBoxesByPharmacyId(this.currentUser.pharmacyId).pipe(first()).subscribe(boxes => {
      this.boxes = boxes;
    });
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'box-modal-basic-title' });
  }

  private scanSuccessHandler($event) {
    const splitedText = $event.split(':');
    const pharmacyId = splitedText[0];
    const boxNumber = splitedText[1];
    this.boxService.getBoxByPharmacyIdAndBoxNumber(pharmacyId, boxNumber)
      .pipe(
        tap(box => this.box = box),
        flatMap(_ => this.boxService.updateBoxPrescriptionId(this.box._id, this.prescription._id) ))
      .subscribe(data => {
        this.alertService.success('Box '  + boxNumber  + ' ausgewählt!');
        this.modalService.dismissAll();
        location.reload();
      }, error => {
        this.alertService.error(error);
        this.modalService.dismissAll();
      });
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

  private chooseBox(box) {
    this.boxService.updateBoxPrescriptionId(box._id, this.prescription._id).subscribe(data => {
      this.alertService.success('Box '  + box.boxNumber  + ' ausgewählt!');
      this.modalService.dismissAll();
      location.reload();
    }, error => {
      this.alertService.error(error);
      this.modalService.dismissAll();
    });
  }
}
