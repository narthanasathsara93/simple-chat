import { User } from '../../models/user.model';
import { ChatService } from '../../services/chat.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users: any[];
  onlineUsersObservable: Observable<any[]>;
  offlineUsersObservable: Observable<any[]>;
  constructor(chatService: ChatService) {
    this.onlineUsersObservable = chatService
      .getUsers('online')
      .snapshotChanges()
      .pipe(
        map((snapshost: any[]) =>
          snapshost.map((action) => ({
            userId: action.key,
            ...action.payload.val(),
          }))
        )
      );

    this.offlineUsersObservable = chatService
      .getUsers('offline')
      .snapshotChanges()
      .pipe(
        map((snapshost: any[]) =>
          snapshost.map((action) => ({
            userId: action.key,
            ...action.payload.val(),
          }))
        )
      );
  }

  ngOnInit(): void {}
}
