import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ContactService } from '../../../services/contact/contact';
import { JobTitleService } from '../../../services/jobTitle/job-title';
import { DepartmentService } from '../../../services/department/department';
import { Contact } from '../../../models/contact';
import { EditContactDialog } from '../edit-contact-dialog/edit-contact-dialog/edit-contact-dialog';
import { environment } from '../../../../environments/environment';
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
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './contacts.html',
  styleUrls: ['./contacts.css'],
})
export class Contacts implements OnInit {
  API_HOST = environment.apiHost;

  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];

  jobTitles: any[] = [];
  departments: any[] = [];

  searchText: string = '';
  dateFrom: string | null = null;
  dateTo: string | null = null;

  createForm!: FormGroup;
  selectedPhoto: File | null = null;
  photoPreview: string | null = null;

  constructor(
    private contactService: ContactService,
    private jobService: JobTitleService,
    private deptService: DepartmentService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadLookups();
    this.loadContacts();
  }

  loadLookups() {
    this.jobService.getAll().subscribe({
      next: (r) => (this.jobTitles = r),
      error: () => Swal.fire('Error', 'Failed to load job titles', 'error'),
    });

    this.deptService.getAll().subscribe({
      next: (r) => (this.departments = r),
      error: () => Swal.fire('Error', 'Failed to load departments', 'error'),
    });
  }

  loadContacts() {
    this.contactService.getAll().subscribe({
      next: (res) => {
        this.contacts = res;
        this.filteredContacts = res;
      },
      error: () => Swal.fire('Error', 'Error loading contacts', 'error'),
    });
  }

  applySearch() {
    const t = this.searchText.toLowerCase();

    this.filteredContacts = this.contacts.filter((c) => {
      const matchesText =
        c.fullName.toLowerCase().includes(t) ||
        c.mobileNumber.toLowerCase().includes(t) ||
        c.email.toLowerCase().includes(t) ||
        c.address.toLowerCase().includes(t) ||
        c.jobTitleName.toLowerCase().includes(t) ||
        c.departmentName.toLowerCase().includes(t);

      const dob = new Date(c.dateOfBirth);

      const matchesDateFrom = !this.dateFrom || dob >= new Date(this.dateFrom);
      const matchesDateTo = !this.dateTo || dob <= new Date(this.dateTo);

      return matchesText && matchesDateFrom && matchesDateTo;
    });
  }

  clearFilters() {
    this.searchText = '';
    this.dateFrom = null;
    this.dateTo = null;
    this.filteredContacts = this.contacts;
  }

  initForm() {
    this.createForm = this.fb.group({
      fullName: ['', Validators.required],
      jobTitleId: [null, Validators.required],
      departmentId: [null, Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\+20(10|11|12|15)[0-9]{8}$/)]],
      dateOfBirth: ['', [Validators.required, ageRangeValidator(18, 60)]],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      photo: [null],
    });
  }

  uploadFile(event: any) {
    const f: File = event.target.files?.[0] ?? null;
    this.selectedPhoto = f;

    if (f) {
      const reader = new FileReader();
      reader.onload = () => (this.photoPreview = reader.result as string);
      reader.readAsDataURL(f);
    } else {
      this.photoPreview = null;
    }
  }

  createContact() {
    if (this.createForm.invalid) {
      if (this.createForm.controls['dateOfBirth'].errors?.['ageRange']) {
        Swal.fire('Invalid Age', 'Age must be between 18 and 60 years', 'warning');
      } else {
        Swal.fire('Validation Error', 'Please fill all required fields', 'warning');
      }

      this.createForm.markAllAsTouched();
      return;
    }

    const fv = this.createForm.value;

    const formData = new FormData();
    formData.append('FullName', fv.fullName!);
    formData.append('JobTitleId', fv.jobTitleId!.toString());
    formData.append('DepartmentId', fv.departmentId!.toString());
    formData.append('MobileNumber', fv.mobileNumber!);
    formData.append('Email', fv.email!);
    formData.append('Address', fv.address!);
    formData.append('DateOfBirth', new Date(fv.dateOfBirth!).toISOString());

    if (this.selectedPhoto) {
      formData.append('Photo', this.selectedPhoto);
    }

    this.contactService.create(formData).subscribe({
      next: () => {
        Swal.fire('Success', 'Contact Created Successfully', 'success');
        this.createForm.reset();
        this.selectedPhoto = null;
        this.photoPreview = null;
        this.loadContacts();
      },
      error: () => Swal.fire('Error', 'Error creating contact', 'error'),
    });
  }

  openEditDialog(contact: Contact) {
    const dialogRef = this.dialog.open(EditContactDialog, {
      width: '600px',
      data: contact,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadContacts();
    });
  }

  delete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This contact will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Contact has been deleted.',
              timer: 1800,
              showConfirmButton: false,
            });
            this.loadContacts();
          },
          error: () => Swal.fire('Error', 'Failed to delete contact', 'error'),
        });
      }
    });
  }

  exportExcel() {
    this.contactService.exportExcel().subscribe({
      next: (file: Blob) => {
        const blob = new Blob([file], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = 'AddressBook.xlsx';
        a.click();

        window.URL.revokeObjectURL(url);

        Swal.fire('Success', 'Excel exported successfully', 'success');
      },
      error: () => Swal.fire('Error', 'Export failed', 'error'),
    });
  }
}
