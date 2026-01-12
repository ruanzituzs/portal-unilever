import { CertificatesService } from './certificates.service';
export declare class CertificatesController {
    private readonly certificatesService;
    constructor(certificatesService: CertificatesService);
    download(quizId: string, req: any, res: any): Promise<void>;
}
