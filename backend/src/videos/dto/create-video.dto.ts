export class CreateVideoDto {
    title: string;
    description?: string;
    url: string; // File path or URL
    duration: number; // In seconds
}
