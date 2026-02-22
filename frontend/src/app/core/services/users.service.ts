import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
    createdAt: string;
    updatedAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private apiUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) { }

    /**
     * Fetches all users from the backend
     */
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    /**
     * Deletes a user by its ID
     * @param id The ID of the user to delete
     */
    deleteUser(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
