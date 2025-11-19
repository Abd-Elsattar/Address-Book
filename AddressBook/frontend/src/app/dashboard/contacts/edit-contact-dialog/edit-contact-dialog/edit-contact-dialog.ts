import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { JobTitleService } from '../../../../services/jobTitle/job-title';
import { DepartmentService } from '../../../../services/department/department';
import { ContactService } from '../../../../services/contact/contact';
import { Contact } from '../../../../models/contact';
import Swal from 'sweetalert2';

function ageRangeValidator(min: number, max: number) {
  return (control: any) => {
    const value = control.value;
    if (!value) return null;

    const dob = new Date(value);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age >= min && age <= max ? null : { ageRange: true };
  };
}

@Component({
  selector: 'app-edit-contact-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './edit-contact-dialog.html',
  styleUrls: ['./edit-contact-dialog.css'],
})
export class EditContactDialog implements OnInit {
  form!: FormGroup;
  jobTitles: any[] = [];
  departments: any[] = [];
  selectedPhoto!: File | null;

  constructor(
    private fb: FormBuilder,
    private jobService: JobTitleService,
    private deptService: DepartmentService,
    private contactService: ContactService,
    public dialogRef: MatDialogRef<EditContactDialog>,
    @Inject(MAT_DIALOG_DATA) public contact: Contact
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadLookups();
    this.patchForm();
  }

  initForm() {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      jobTitleId: [null, Validators.required],
      departmentId: [null, Validators.required],

      mobileNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\+20(10|11|12|15)[0-9]{8}$/)
        ]
      ],

      dateOfBirth: [
        '',
        [
          Validators.required,
          ageRangeValidator(18, 60)
        ]
      ],

      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      photo: [null],
    });
  }

  loadLookups() {
    this.jobService.getAll().subscribe((r) => (this.jobTitles = r));
    this.deptService.getAll().subscribe((r) => (this.departments = r));
  }

  patchForm() {
    this.form.patchValue({
      fullName: this.contact.fullName,
      jobTitleId: this.contact.jobId,
      departmentId: this.contact.departmentId,
      mobileNumber: this.contact.mobileNumber,
      dateOfBirth: this.contact.dateOfBirth,
      address: this.contact.address,
      email: this.contact.email,
    });
  }

  uploadFile(event: any) {
    this.selectedPhoto = event.target.files[0];
  }

  save() {
    if (this.form.invalid) {

      let msg = 'Please fill all required fields';

      if (this.form.controls['mobileNumber'].errors?.['pattern']) {
        msg = 'Invalid mobile number format must start with +2';
      }

      if (this.form.controls['dateOfBirth'].errors?.['ageRange']) {
        msg = 'Age must be between 18 and 60 years';
      }

      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: msg,
        confirmButtonColor: '#d33',
      });
      return;
    }

    Swal.fire({
      title: 'Updating Contact...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const formData = new FormData();

    formData.append('FullName', this.form.value.fullName!);
    formData.append('JobTitleId', this.form.value.jobTitleId!);
    formData.append('DepartmentId', this.form.value.departmentId!);
    formData.append('MobileNumber', this.form.value.mobileNumber!);
    formData.append('DateOfBirth', this.form.value.dateOfBirth!);
    formData.append('Address', this.form.value.address!);
    formData.append('Email', this.form.value.email!);

    if (this.selectedPhoto) {
      formData.append('Photo', this.selectedPhoto);
    }

    this.contactService.update(this.contact.id, formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Contact has been updated successfully.',
          timer: 1700,
          showConfirmButton: false,
        });

        this.dialogRef.close(true);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'Something went wrong while updating the contact.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }
}
