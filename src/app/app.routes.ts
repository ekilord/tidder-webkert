import { Routes } from '@angular/router';
import {FeedComponent} from "./pages/feed/feed.component";
import {LoginComponent} from "./pages/login/login.component";
import {SignUpComponent} from "./pages/signup/sign-up.component";
import {CreatePostComponent} from "./pages/create-post/create-post.component";
import {CreateSubComponent} from "./pages/create-sub/create-sub.component";
import {SubComponent} from "./pages/sub/sub.component";
import {PostComponent} from "./pages/post/post.component";
import {SublistComponent} from "./pages/sublist/sublist.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import {authGuard} from "./shared/guards/auth.guard";
import {AuthState} from "./models/AuthState";

export const routes: Routes = [
  { path: 'feed', component: FeedComponent },
  { path: 'login', component: LoginComponent,
    canActivate: [authGuard], data: { maxAuthState: AuthState.Guest } },
  { path: 'signup', component: SignUpComponent,
    canActivate: [authGuard], data: { maxAuthState: AuthState.Guest } },
  { path: 'sublist', component: SublistComponent },
  { path: 'profile', component: ProfileComponent,
    canActivate: [authGuard], data: { minAuthState: AuthState.User } },
  { path: 'create-sub', component: CreateSubComponent,
    canActivate: [authGuard], data: { minAuthState: AuthState.User } },
  { path: ':sub', component: SubComponent },
  { path: ':sub/create-post', component: CreatePostComponent,
    canActivate: [authGuard], data: { minAuthState: AuthState.User } },
  { path: ':sub/:post', component: PostComponent },
  { path: '', redirectTo: '/feed', pathMatch: 'full' }
];
