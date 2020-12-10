import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmValidator } from '../../confirm.validator';
@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
})
export class SignupFormComponent {
  email: string;
  password: string;
  userName: string;
  errorMsg: string;
  signUpForm: FormGroup;
  submitted = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  //validate form details
  ngOnInit() {
    this.signUpForm = this.formBuilder.group(
      {
        userName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: ConfirmValidator('password', 'confirmPassword'),
      }
    );
  }

  //getter for easy access to form fields
  get f() {
    return this.signUpForm.controls;
  }
  //pass data to sign up method
  onSubmit() {
    this.submitted = true;

    if (this.signUpForm.invalid) {
      console.log('sign up error');
      return;
    } else {
      const user = this.signUpForm.value;      
      this.signUp(user);
    }
  }
  //clear the form
  onReset() {
    this.submitted = false;
    this.signUpForm.reset();
  }

  // collects user details and send to the firebase sign up function
  signUp(user: any) {
    const email = user.email;
    const password = user.password;
    const userName = user.userName;
    this.authService
      .signUp(email, password, userName)
      .then(() => this.router.navigate(['verify']))
      .catch((error: { message: string }) => console.log('sign up error'));
  }
}
