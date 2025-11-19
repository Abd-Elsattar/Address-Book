import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { JobTitle } from '../../../models/job-title';
import { JobTitleService } from '../../../services/jobTitle/job-title';
import { EditJobTitleDialog } from '../edit-job-title-dialog/edit-job-title-dialog/edit-job-title-dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-jobtitles',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './job-titles.html',
  styleUrls: ['./job-titles.css'],
})
export class JobTitles implements OnInit {
  jobTitles: JobTitle[] = [];
  form!: FormGroup;

  constructor(
    private jobService: JobTitleService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadJobTitles();
  }

  initForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
    });
  }

  loadJobTitles() {
    this.jobService.getAll().subscribe({
      next: (res) => (this.jobTitles = res),
      error: () => Swal.fire('Error', 'Failed to load job titles', 'error'),
    });
  }

  createJobTitle() {
    if (this.form.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Missing field',
        text: 'Job title is required.',
      });
      return;
    }

    const model = { title: this.form.value.title };

    this.jobService.create(model).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'Job Title added successfully.',
          timer: 1500,
          showConfirmButton: false,
        });
        this.form.reset();
        this.loadJobTitles();
      },
      error: () => Swal.fire('Error', 'Failed to create job title', 'error'),
    });
  }

  openEditDialog(job: JobTitle) {
    const dialogRef = this.dialog.open(EditJobTitleDialog, {
      data: job,
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.loadJobTitles();
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Job Title updated successfully.',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }

  delete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Deleting this job title may affect linked contacts.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.jobService.delete(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Job Title deleted successfully.',
            timer: 1500,
            showConfirmButton: false,
          });
          this.loadJobTitles();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text: err?.error?.message ?? 'This job title is linked to contacts.',
          });
        },
      });
    });
  }
}
