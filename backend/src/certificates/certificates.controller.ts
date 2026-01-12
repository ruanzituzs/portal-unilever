import { Controller, Get, Param, Res, UseGuards, Req } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

@Controller('certificates')
@UseGuards(JwtAuthGuard)
export class CertificatesController {
    constructor(private readonly certificatesService: CertificatesService) { }

    @Get(':quizId/download')
    @Get(':quizId/download')
    async download(@Param('quizId') quizId: string, @Req() req: any, @Res() res: any) {
        const buffer = await this.certificatesService.generateCertificate(req.user.userId, quizId);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="certificate-${quizId}.pdf"`,
            'Content-Length': buffer.length,
        });

        res.end(buffer);
    }
}
