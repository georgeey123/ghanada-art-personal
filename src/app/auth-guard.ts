import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    map(user => {
      if (user) { return true; }
      return router.createUrlTree(['/admin/login']);
    })
  );
};
