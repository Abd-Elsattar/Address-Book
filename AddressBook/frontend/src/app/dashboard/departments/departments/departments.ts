import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DepartmentService } from '../../../services/department/department';
import { Department } from '../../../models/department';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { EditDepartmentDialog } from '../edit-department-dialog/edit-department-dialog';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './departments.html',
  styleUrls: ['./departments.css'],
})
export class Departments implements OnInit {
  departments: Department[] = [];
  form!: FormGroup;

  constructor(
    private departmentService: DepartmentService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDepartments();
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
  }

  loadDepartments() {
    this.departmentService.getAll().subscribe({
      next: (res) => (this.departments = res),
      error: () => Swal.fire('Error', 'Error loading departments', 'error'),
    });
  }

  createDepartment() {
    if (this.form.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Field',
        text: 'Department name is required.',
      });
      return;
    }

    this.departmentService.create({ name: this.form.value.name }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'Department added successfully.',
          timer: 1500,
          showConfirmButton: false,
        });
        this.form.reset();
        this.loadDepartments();
      },
      error: () => Swal.fire('Error', 'Could not create department', 'error'),
    });
  }

  openEditDialog(dep: Department) {
    const dialogRef = this.dialog.open(EditDepartmentDialog, {
      data: dep,
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadDepartments();

        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Department updated successfully.',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }

  delete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Deleting this department may affect linked contacts.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.departmentService.delete(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Department deleted successfully.',
            timer: 1500,
            showConfirmButton: false,
          });
          this.loadDepartments();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text:
              err?.error?.message ?? 'This department is linked to contacts and cannot be deleted.',
          });
        },
      });
    });
  }
}
