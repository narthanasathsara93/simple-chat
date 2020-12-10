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
    //store user data in local storage
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

  //check the user is logged in
  public isAuthenticated(): boolean {
    const loggedIn: any = localStorage.getItem('isUserLoggedIn');
    if (loggedIn === 'loggedIn') {
      return true;
    } else if (loggedIn === null || !loggedIn) {
      return false;
    }
  }
  public get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null && user.emailVerified !== false ? true : false;
  }
  isEmailVerified() {
    const subscription = this.getUser(this.userData.uid).subscribe((data) => {
      if (data) {
        subscription.unsubscribe();
      }
      if (this.userData.email === data.email) {
        return true;
      } else {
        return false;
      }
    });
    //  this.db.object(path);
  }
  //get current user ID (firebase uuid)
  getUid(): string {
    let uuid = firebase.default.auth().currentUser.uid;
    return uuid;
  }
  // returns authenticated user
  authUser() {
    return this.user;
  }

  //get current user ID from authstate
  get currentUserId(): string {
    return this.authState !== null ? this.authState.uid : '';
  }

  // register user details in firebase
  signUp(email: string, password: string, userName: string): any {
    return firebase.default
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.sendVerificationMail();
        this.authState = user;
        const status = 'offline';
        const uid = this.getUid();
        this.setUserData(email, userName, status, uid);
        localStorage.setItem('isUserLoggedIn', 'loggedOut');
      })
      .catch(function (error) {});
  }

  // sign in to firebase
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

  // user sign out from the app
  signOut(): any {
    this.setUserStatus('offline');
    return firebase.default
      .auth()
      .signOut()
      .then((data) => {
        localStorage.removeItem('user');
        //  localStorage.setItem('isUserLoggedIn', 'loggedOut');
        this.router.navigate(['home']);
      })
      .catch(function (error) {});
  }
  // Send email verfificaiton when new user sign up
  async sendVerificationMail() {
    return (await this.afAuth.currentUser).sendEmailVerification().then(() => {
      this.router.navigate(['verify']);
    });
  }

  // create a user object and save in firebase
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

  //update the user status in db(offline or online)
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

  //get a user by id
  getUser(uid: string): Observable<any> {
    return this.db.object('/users/' + uid).valueChanges();
  }
  //get all users
  getUsers(status?: string) {
    const path = '/users';
    return this.db.list(path, (ref) => {
      return ref
        .orderByChild('loggedInTimestamp')
        .ref.orderByChild('status')
        .equalTo(status);
    });
  }
}
