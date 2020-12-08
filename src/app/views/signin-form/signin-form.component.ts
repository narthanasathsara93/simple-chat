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
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  signIn() {
    this.authService
      .signIn(this.email, this.password)
      .then(() => this.router.navigate(['chat']))
      .catch((error: { message: string }) => (this.errorMsg = error.message));
  }
}
