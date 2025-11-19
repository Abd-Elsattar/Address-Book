import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth/auth';
import { Router } from '@angular/router';
import { Register } from '../../models/register';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill all required fields.',
      });
      return;
    }

    const model = this.form.getRawValue() as Register;

    Swal.fire({
      title: 'Creating Account...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    this.auth.register(model).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Account created!',
          text: 'Your account has been created successfully.',
          timer: 1500,
          showConfirmButton: false,
        });

        this.router.navigate(['/login']);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Registration failed',
          text: 'Something went wrong, please try again.',
        });
      },
    });
  }
}
