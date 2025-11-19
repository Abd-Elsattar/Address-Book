import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JobTitle } from '../../models/job-title';
import { CreateJobTitle } from '../../models/create-job-title';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobTitleService {
  private apiUrl = `${environment.apiUrl}/jobtitles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<JobTitle[]> {
    return this.http.get<JobTitle[]>(this.apiUrl);
  }

  getById(id: number): Observable<JobTitle> {
    return this.http.get<JobTitle>(`${this.apiUrl}/${id}`);
  }

  create(model: CreateJobTitle): Observable<void> {
    return this.http.post<void>(this.apiUrl, model);
  }

  update(id: number, model: CreateJobTitle): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, model);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
