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
  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user = this.authService.authUser();
    this.user.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.userObservable = this.db
          .object('/users/' + user.uid)
          .valueChanges();
        this.userObservable.subscribe((data) => {
          this.userData = data;
          this.textHi = 'Hi, ';
        });
      }
    });
  }

  isThisHome() {
    const currentUrl = window.location.href;
    return currentUrl.endsWith('/home');
  }
  signOut() {
    this.authService.signOut();
  }
}
