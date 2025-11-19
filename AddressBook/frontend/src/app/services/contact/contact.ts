import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contact } from '../../models/contact';
import { SearchContact } from '../../models/search-contact';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private baseUrl = environment.apiUrl + '/contacts';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.baseUrl);
  }

  getById(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.baseUrl}/${id}`);
  }

  create(formData: FormData): Observable<Contact> {
    return this.http.post<Contact>(this.baseUrl, formData);
  }

  update(id: number, formData: FormData): Observable<Contact> {
    return this.http.put<Contact>(`${this.baseUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  search(model: SearchContact): Observable<Contact[]> {
    return this.http.post<Contact[]>(`${this.baseUrl}/search`, model);
  }

  exportExcel(): Observable<Blob> {
    return this.http.get(this.baseUrl + '/export', { responseType: 'blob' });
  }
}
