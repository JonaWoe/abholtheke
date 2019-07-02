import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService, AuthenticationService } from '../_services';

@Component({templateUrl: 'patient-register.component.html'})
export class PatientRegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/patient']);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      insuranceId: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10) ]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      eMail: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
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
    this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Registrierung erfolgreich!', true);
          this.router.navigate(['/patient/login']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

}
