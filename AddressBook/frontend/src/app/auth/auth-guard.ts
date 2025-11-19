import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    Swal.fire({
      icon: 'warning',
      title: 'Not Authorized',
      text: 'Please login to continue.',
      timer: 2000,
      showConfirmButton: false,
    });

    router.navigate(['/login']);
    return false;
  }

  const payload = JSON.parse(atob(token.split('.')[1]));
  const exp = payload.exp * 1000;
  const now = Date.now();

  if (now > exp) {
    localStorage.removeItem('token');

    Swal.fire({
      icon: 'warning',
      title: 'Session Expired',
      text: 'Please login again.',
      timer: 2000,
      showConfirmButton: false,
    });

    router.navigate(['/login']);
    return false;
  }
  return true;
};
