import { User } from './../models/user.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: Observable<firebase.default.User>;
  private authState: any;
  userData: any;
  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    private db: AngularFireDatabase
  ) {
    this.user = afAuth.authState;
    this.user.subscribe((user_) => {
      if (user_) {
        this.userData = user_;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  public isAuthenticated(): boolean {
    const loggedIn: any = localStorage.getItem('isUserLoggedIn');
    if (loggedIn === 'loggedIn') {
      return true;
    } else if (loggedIn === null || !loggedIn) {
      return false;
    }
  }
  getUid(): string {
    let uuid = firebase.default.auth().currentUser.uid;
    return uuid;
  }
  authUser() {
    return this.user;
  }
  get currentUserId(): string {
    return this.authState !== null ? this.authState.uid : '';
  }
  signUp(email: string, password: string, userName: string): any {
    return firebase.default
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        const status = 'online';
        const uid = this.getUid();
        this.setUserData(email, userName, status, uid);
        localStorage.setItem('isUserLoggedIn', 'loggedIn');
      })
      .catch(function (error) {});
  }

  signIn(email: string, password: string): any {
    return firebase.default
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((data) => {
        localStorage.setItem('isUserLoggedIn', 'loggedIn');
        this.setUserStatus('online');
      })
      .catch(function (error) {
        console.log(' signIn error ', error);
      });
  }
  signOut(): any {
    this.setUserStatus('offline');
    return firebase.default
      .auth()
      .signOut()
      .then((data) => {
        localStorage.setItem('isUserLoggedIn', 'loggedOut');
      })
      .catch(function (error) {});
  }
  setUserData(
    email: string,
    userName: string,
    status: string,
    uid: string
  ): void {
    const path = `users/${uid}`;
    const data = {
      email: email,
      userName: userName,
      status: status,
      loggedInTimestamp: Date.now(),
    };
    this.db
      .object(path)
      .update(data)
      .catch((error) => console.log(error));
  }
  setUserStatus(status: string): void {
    const uid = this.getUid();
    const path = `users/${uid}/`; 
    let data: any = {};
    console.log('this.status(); ', status);
    if (status === 'offline') {
      data = {
        status: status,
        loggedOutTimestamp: Date.now(),
      };
    } else if (status === 'online') {
      data = {
        status: status,
        loggedInTimestamp: Date.now(),
      };
    }

    this.db
      .object(path)
      .update(data)
      .catch((error) => console.log(error));
  }
}
