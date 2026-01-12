import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Video {
    id: string;
    title: string;
    description: string;
    url: string;
    duration: number;
}

@Injectable({
    providedIn: 'root'
})
export class VideosService {
    private apiUrl = environment.apiUrl + '/videos';

    constructor(private http: HttpClient) { }

    getVideos(): Observable<Video[]> {
        return this.http.get<Video[]>(this.apiUrl);
    }

    uploadVideo(formData: FormData): Observable<any> {
        return this.http.post(this.apiUrl, formData);
    }

    deleteVideo(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
