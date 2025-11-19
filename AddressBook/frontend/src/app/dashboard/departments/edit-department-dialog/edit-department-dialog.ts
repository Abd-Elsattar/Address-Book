import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DepartmentService } from '../../../services/department/department';
import { Department } from '../../../models/department';
import { CreateDepartment } from '../../../models/create-department';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-department-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './edit-department-dialog.html',
  styleUrls: ['./edit-department-dialog.css'],
})
export class EditDepartmentDialog {
  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditDepartmentDialog>,
    private fb: FormBuilder,
    private depService: DepartmentService,
    @Inject(MAT_DIALOG_DATA) public department: Department
  ) {
    this.form = this.fb.group({
      name: [department.name, Validators.required],
    });
  }

  save() {
    if (this.form.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Field',
        text: 'Department name is required.',
      });
      return;
    }

    const model: CreateDepartment = {
      name: this.form.value.name!,
    };

    Swal.fire({
      title: 'Updating...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    this.depService.update(this.department.id, model).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Department updated successfully.',
          timer: 1500,
          showConfirmButton: false,
        });

        this.dialogRef.close(true);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'Unable to update department.',
        });
      },
    });
  }
}
