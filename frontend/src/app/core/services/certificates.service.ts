import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CertificatesService {
    private apiUrl = `${environment.apiUrl}/certificates`;

    constructor(private http: HttpClient) { }

    downloadCertificate(quizId: string): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/${quizId}/download`, {
            responseType: 'blob'
        });
    }
}
