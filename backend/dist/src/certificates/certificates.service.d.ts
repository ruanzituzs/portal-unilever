import { PrismaService } from '../prisma.service';
export declare class CertificatesService {
    private prisma;
    constructor(prisma: PrismaService);
    generateCertificate(userId: string, quizId: string): Promise<Buffer>;
}
