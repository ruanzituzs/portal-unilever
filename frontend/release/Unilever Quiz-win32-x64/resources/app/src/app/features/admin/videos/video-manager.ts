import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VideosService, Video } from '../../../core/services/videos.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-video-manager',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './video-manager.html'
})
export class VideoManagerComponent implements OnInit {
    uploadForm: FormGroup;
    videos: Video[] = [];
    selectedFile: File | null = null;
    uploading = false;
    apiUrl = environment.apiUrl;

    constructor(private fb: FormBuilder, private videosService: VideosService) {
        this.uploadForm = this.fb.group({
            title: ['', Validators.required],
            description: [''],
            duration: [0]
        });
    }

    ngOnInit() {
        this.loadVideos();
    }

    loadVideos() {
        this.videosService.getVideos().subscribe(videos => this.videos = videos);
    }

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    }

    onSubmit() {
        if (this.uploadForm.valid && this.selectedFile) {
            this.uploading = true;
            const formData = new FormData();
            formData.append('file', this.selectedFile);
            formData.append('title', this.uploadForm.get('title')?.value);
            formData.append('description', this.uploadForm.get('description')?.value);
            formData.append('duration', this.uploadForm.get('duration')?.value);

            this.videosService.uploadVideo(formData).subscribe({
                next: () => {
                    this.uploading = false;
                    this.selectedFile = null;
                    this.uploadForm.reset();
                    this.loadVideos();
                    alert('Vídeo enviado com sucesso!');
                },
                error: (err) => {
                    this.uploading = false;
                    console.error(err);
                    alert('Erro ao enviar vídeo.');
                }
            });
        }
    }

    deleteVideo(id: string) {
        if (confirm('Tem certeza que deseja apagar este vídeo?')) {
            this.videosService.deleteVideo(id).subscribe(() => this.loadVideos());
        }
    }
}
