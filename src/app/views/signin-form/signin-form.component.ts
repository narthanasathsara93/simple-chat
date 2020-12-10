import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin-form',
  templateUrl: './signin-form.component.html',
  styleUrls: ['./signin-form.component.scss'],
})
export class SignInFormComponent implements OnInit {
  email: string;
  password: string;
  errorMsg: string;

  signInForm: FormGroup;
  submitted = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}
  //getter for easy access to form fields
  get f() {
    return this.signInForm.controls;
  }
  //pass data to sign in method
  onSubmit() {
    this.submitted = true;
    if (this.signInForm.invalid) {    
      this.router.navigate(['signin']);
      return;
    } else {
      const user = this.signInForm.value;
      this.signIn(user);
    }
  }
  // call the sign in method in firebase
  signIn(user: any) {
    const email = user.email;
    const password = user.password;
    const x = this.authService
      .signIn(email, password)
      .then(() => this.router.navigate(['chat']))
      .catch((error: { message: string }) => {
        this.router.navigate(['signin']);
      });
  }
}
