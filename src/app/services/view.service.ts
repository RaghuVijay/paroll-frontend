import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { List } from '../models/list.model';
import { environment } from '../config/environment';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  private apiUrl = `${environment.apiUrl}/payslips`;
  constructor(private http: HttpClient) {}

  getPayslips(userId: string): Observable<List[]> {
    const headers = new HttpHeaders({
        'ngrok-skip-browser-warning': 'true'
      });
  
    return this.http.get<List[]>(this.apiUrl + '/' + userId,  { headers });
  }
}