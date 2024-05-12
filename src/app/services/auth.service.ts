import {inject, Injectable} from '@angular/core';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, Auth, User, createUserWithEmailAndPassword, sendEmailVerification } from '@angular/fire/auth';
import {AuthState} from "../models/AuthState";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly auth: Auth = inject(Auth);
  public user: User | null;
  public waitForAuthInit: Promise<void>;
  public authState = AuthState.Guest;
  authStateChange: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor() {
    this.user = null;

    this.waitForAuthInit = new Promise((resolve, reject) => {
      const unsubscribe = this.auth.onAuthStateChanged(_ => { unsubscribe(); resolve(); }, reject);
    });

    onAuthStateChanged(this.auth, this.handleAuthStateChange);
  }

  private handleAuthStateChange = (user: User | null): void => {
    this.user = user;

    if (user) {
      this.setAuthState(user);
    } else {
      this.setAuthState();
    }

    this.authStateChange.next(user);
  }

  private setAuthState(user: User | undefined = undefined) {
    if (!user) {
      this.authState = AuthState.Guest;
      return;
    }

    if (user) {
      this.authState = AuthState.User;
    } else {
      this.authState = AuthState.Guest;
    }
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async register(email: string, password: string): Promise<void> {
    await createUserWithEmailAndPassword(this.auth, email, password);
  }
}
