import { AuthService } from './../../services/auth.service';
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

  constructor(authService: AuthService) {
    //get online users
    this.onlineUsersObservable = authService
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
    //get offline users
    this.offlineUsersObservable = authService
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
