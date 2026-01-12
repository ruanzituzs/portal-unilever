import { Injectable, NotFoundException } from '@nestjs/common';
import PDFDocument = require('pdfkit');
import { PrismaService } from '../prisma.service';

@Injectable()
export class CertificatesService {
    constructor(private prisma: PrismaService) { }

    async generateCertificate(userId: string, quizId: string): Promise<Buffer> {
        const attempt = await this.prisma.userQuizAttempt.findFirst({
            where: { userId, quizId, passed: true },
            include: { user: true, quiz: true }
        });

        if (!attempt) {
            throw new NotFoundException('Certificate not found or quiz not passed');
        }

        return new Promise((resolve) => {
            const doc = new PDFDocument({
                size: 'A4',
                layout: 'landscape',
                margin: 0
            });

            const buffers: Buffer[] = [];
            doc.on('data', (buffer: any) => buffers.push(buffer));
            doc.on('end', () => resolve(Buffer.concat(buffers)));

            // --- Certificate Design ---

            // Background / Border
            doc.rect(0, 0, doc.page.width, doc.page.height).fill('#F8FAFC');
            doc.lineWidth(20).strokeColor('#1F36C7').rect(0, 0, doc.page.width, doc.page.height).stroke();

            // Header
            doc.moveDown(2);
            doc.font('Helvetica-Bold').fontSize(40).fillColor('#101c4f').text('Unilever', { align: 'center' });
            doc.moveDown(0.5);
            doc.fontSize(20).fillColor('#64748b').text('Corporate Learning Certificate', { align: 'center' });

            // Body
            doc.moveDown(2);
            doc.fontSize(16).fillColor('#1e293b').text('This is to certify that', { align: 'center' });

            doc.moveDown(1);
            doc.fontSize(30).fillColor('#1F36C7').text(attempt.user.name, { align: 'center' });

            doc.moveDown(1);
            doc.fontSize(16).fillColor('#1e293b').text('has successfully completed the assessment', { align: 'center' });

            doc.moveDown(0.5);
            doc.fontSize(24).font('Helvetica-Bold').text(attempt.quiz.title, { align: 'center' });

            // Footer
            doc.moveDown(4);
            const date = new Date(attempt.completedAt).toLocaleDateString();
            doc.fontSize(14).font('Helvetica').text(`Date: ${date}`, 100, 500);

            doc.text('Director of Learning', 600, 500);
            doc.moveTo(600, 490).lineTo(750, 490).stroke(); // Signature line

            doc.end();
        });
    }
}
