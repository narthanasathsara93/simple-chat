import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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

  constructor(private authService: AuthService, private router: Router) {}

  signUp() {
    const email = this.email;
    const password = this.password;
    const userName = this.userName;
    this.authService
      .signUp(email, password, userName)
      .then(() => this.router.navigate(['chat']))
      .catch((error: { message: string; }) => (this.errorMsg = error.message));
  }
}
