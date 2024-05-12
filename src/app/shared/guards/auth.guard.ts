import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthState } from '../../models/AuthState';

const guestDefault = [''];
const userDefault = [''];

export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  let minAuthState: AuthState = route.data['minAuthState'] ?? AuthState.Guest;
  let maxAuthState: AuthState = route.data['maxAuthState'] ?? AuthState.User;

  await authService.waitForAuthInit;

  if (authService.authState < minAuthState || authService.authState > maxAuthState) {
    switch (authService.authState) {
      case AuthState.Guest:
        return router.createUrlTree(guestDefault);
      case AuthState.User:
        return router.createUrlTree(userDefault);
    }
  }

  return true;
};
