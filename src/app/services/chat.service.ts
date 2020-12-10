import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { map } from 'rxjs/operators';
import { ChatMessage } from '../models/chat-message.model';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  chatMessageObservable: Observable<any>;
  ChatMessagesObservable: Observable<ChatMessage[]>;
  userObservable: Observable<any>;
  usersObservable: Observable<any[]>;
  userData: any = {};
  users: any[];
  chatMessage: ChatMessage;

  constructor(
    private db: AngularFireDatabase,
    private fireAuth: AngularFireAuth,
    private authService: AuthService
  ) {
    this.fireAuth.authState.subscribe((auth) => {
      if (auth !== undefined && auth !== null) {
        const uid = this.authService.getUid();
        this.userObservable = this.db.object('/users/' + uid).valueChanges();
        this.userObservable.subscribe((data) => {
          this.userData = data;
        });
      }
    });
  }

  sendMessage(message: string) {
    const timestamp = Date.now();
    this.ChatMessagesObservable = this.getMessages();
    let msg = {
      message: message,
      timeSent: timestamp,
      userName: this.userData.userName,
      email: this.userData.email,
    };
    this.saveMessage(msg);
  }

  saveMessage = (msg: any) => {
    const newMessage = this.db.database.ref('message');
    return newMessage.push(msg);
  };
  getMessages(): Observable<ChatMessage[]> {
    return this.db
      .list('message', (ref) => {
        return ref.orderByKey().limitToLast(50);
      })
      .snapshotChanges()
      .pipe(
        map((snapshost: any[]) =>
          snapshost.map((action) => ({
            activityId: action.key,
            ...action.payload.val(),
          }))
        )
      );
  }
  getTimeStamp() {
    const now = new Date();
    const date =
      now.getUTCFullYear() +
      '/' +
      (now.getUTCMonth() + 1) +
      '/' +
      now.getUTCDate();

    const time =
      now.getUTCHours() + '/' + now.getUTCMinutes() + '/' + now.getUTCSeconds();
    return date + ' ' + time;
  }



}
