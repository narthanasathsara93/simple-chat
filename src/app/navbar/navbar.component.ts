import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  user: Observable<firebase.default.User>;
  userObservable: Observable<any>;
  userData: any = {};
  textHi: string = null;
  public toChatRoom = false;
  isSignedIn = false;
  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService
  ) {}

  //get user data from userObservable;
  ngOnInit() {
 
    this.user = this.authService.authUser();
    this.user.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.userObservable = this.authService.getUser(user.uid);
        this.userObservable.subscribe((data) => {
          this.userData = data;
          this.textHi = 'Hi, ';
        });
      }
    });

    const x = localStorage.getItem('isUserLoggedIn');
    if (x === 'loggedOut') {
      this.isSignedIn = true;
    } else if (x === 'loggedIn') {
      this.isSignedIn = false;
    }
    console.log("localStssdfdforage.getItem('isUserLoggedIn')>>", x);
  }

  isThisHome() {
    const currentUrl = window.location.href;
    return currentUrl.endsWith('/home');
  }
  signOut() {
    this.authService.signOut();
  }
}
