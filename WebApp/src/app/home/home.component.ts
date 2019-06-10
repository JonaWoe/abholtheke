import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';


import { User } from '../_models';
import { AuthenticationService } from '../_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
  currentUser: User;
  currentUserSubscription: Subscription;

  constructor(
    private authenticationService: AuthenticationService) 
    {
      this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
        this.currentUser = user;
      })
    }

  ngOnInit() {
  }
}
