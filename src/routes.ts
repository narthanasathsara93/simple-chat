import { VerifyComponent } from './app/views/verify/verify.component';
import { SignupFormComponent } from '../src/app/views/signup-form/signup-form.component';
import { SignInFormComponent } from '../src/app/views/signin-form/signin-form.component';
import { ChatRoomComponent } from '../src/app/views/chat-room/chat-room.component';
import { HomeComponent } from '../src/app/views/home/home.component';
import { AuthGuard } from './app/auth/auth.guard';
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: 'signup', component: SignupFormComponent },
  { path: 'signin', component: SignInFormComponent },
  {
    path: 'chat',
    canActivate: [AuthGuard],
    component: ChatRoomComponent,
  },
  { path: 'home', component: HomeComponent },
  { path: 'verify', component: VerifyComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
