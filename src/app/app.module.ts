//import { AuthGuardService } from './services/auth-guard.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppComponent } from './app.component';
import { ChatFormComponent } from '../app/views/chat-form/chat-form.component';
import { ChatRoomComponent } from '../app/views/chat-room/chat-room.component';
import { FeedComponent } from '../app/views/feed/feed.component';
import { MessageComponent } from '../app/views/message/message.component';
import { SignInFormComponent } from '../app/views/signin-form/signin-form.component';
import { SignupFormComponent } from '../app/views/signup-form/signup-form.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserListComponent } from '../app/views/user-list/user-list.component';
import { UserItemComponent } from '../app/views/user-item/user-item.component';

import { ChatService } from './services/chat.service';
import { AuthService } from './services/auth.service';

import { appRoutes } from '../routes';
import { environment } from '../environments/environment';
import { HomeComponent } from './views/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatFormComponent,
    ChatRoomComponent,
    FeedComponent,
    MessageComponent,
    SignInFormComponent,
    SignupFormComponent,
    NavbarComponent,
    UserListComponent,
    UserItemComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [AuthService, ChatService],
  bootstrap: [AppComponent],
})
export class AppModule {}
