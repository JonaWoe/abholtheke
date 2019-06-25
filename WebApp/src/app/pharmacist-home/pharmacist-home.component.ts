import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Box, Pharmacist } from '../_models';
import { AuthenticationService, BoxService } from '../_services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pharmacy',
  templateUrl: './pharmacist-home.component.html',
  styleUrls: ['./pharmacist-home.component.css']
})
export class PharmacistHomeComponent implements OnInit {

  currentUser: Pharmacist;
  currentUserSubscription: Subscription;
  boxes: Box[] = [];

  constructor(private boxService: BoxService, private authenticationService: AuthenticationService,) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = (user as unknown as Pharmacist);
    });
  }

  ngOnInit() {
    this.loadAllBoxes();
  }

  private loadAllBoxes() {
    this.boxService.getBoxesByPharmacyId(this.currentUser.pharmacyId).pipe(first()).subscribe(boxes => {
      this.boxes = boxes;
    });
  }

  private getFormatedDate(date)  {
    return new Date(date).toLocaleString();
  }

}
