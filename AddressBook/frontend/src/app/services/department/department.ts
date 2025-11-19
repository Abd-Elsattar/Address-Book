import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Department } from '../../models/department';
import { Observable } from 'rxjs';
import { CreateDepartment } from '../../models/create-department';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private baseUrl = environment.apiUrl + '/departments';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(this.baseUrl);
  }

  getById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.baseUrl}/${id}`);
  }

  create(model: CreateDepartment) {
    return this.http.post(this.baseUrl, model);
  }

  update(id: number, model: CreateDepartment): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, model);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
