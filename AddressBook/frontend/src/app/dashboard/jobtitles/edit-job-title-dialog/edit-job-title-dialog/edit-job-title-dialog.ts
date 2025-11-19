import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { JobTitleService } from '../../../../services/jobTitle/job-title';
import { ToastrService } from 'ngx-toastr';
import { CreateJobTitle } from '../../../../models/create-job-title';
import { JobTitle } from '../../../../models/job-title';

@Component({
  selector: 'app-edit-job-title-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './edit-job-title-dialog.html',
  styleUrls: ['./edit-job-title-dialog.css'],
})
export class EditJobTitleDialog {
  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditJobTitleDialog>,
    @Inject(MAT_DIALOG_DATA) public job: JobTitle,
    private fb: FormBuilder,
    private jobService: JobTitleService,
    private toastr: ToastrService
  ) {
    this.initForm();
    this.patchForm();
  }

  initForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
    });
  }

  patchForm() {
    this.form.patchValue({
      title: this.job.title,
    });
  }

  save() {
    if (this.form.invalid) return;

    const model: CreateJobTitle = {
      title: this.form.value.title!,
    };

    this.jobService.update(this.job.id, model).subscribe({
      next: () => {
        this.toastr.success('Job Title updated');
        this.dialogRef.close(true);
      },
      error: () => this.toastr.error('Error updating job title'),
    });
  }
}
