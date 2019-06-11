import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService, AuthenticationService } from '../../_services';
import { AuthService, SocialUser } from 'angularx-social-login';

@Component({templateUrl: 'withGoogle.component.html'})
export class WithGoogleComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  private user: SocialUser;
  private loggedIn: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      insuranceId: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10) ]], //todo change min lenght
    });

    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    const tempUser = {
        insuranceId: this.registerForm.value.insuranceId,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        eMail: this.user.email,
        googleId: this.user.id,
        googleIdToken: this.user.idToken
    };

    this.userService.register(tempUser)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Registrierung erfolgreich!', true);
          this.authenticationService.loginWithGoogle(this.user.id, this.user.idToken)
            .pipe(first())
            .subscribe(_ => {
              this.router.navigate(['/']);
            });
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

}
