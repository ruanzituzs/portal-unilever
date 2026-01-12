"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const PDFDocument = require("pdfkit");
const prisma_service_1 = require("../prisma.service");
let CertificatesService = class CertificatesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateCertificate(userId, quizId) {
        const attempt = await this.prisma.userQuizAttempt.findFirst({
            where: { userId, quizId, passed: true },
            include: { user: true, quiz: true }
        });
        if (!attempt) {
            throw new common_1.NotFoundException('Certificate not found or quiz not passed');
        }
        return new Promise((resolve) => {
            const doc = new PDFDocument({
                size: 'A4',
                layout: 'landscape',
                margin: 0
            });
            const buffers = [];
            doc.on('data', (buffer) => buffers.push(buffer));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.rect(0, 0, doc.page.width, doc.page.height).fill('#F8FAFC');
            doc.lineWidth(20).strokeColor('#1F36C7').rect(0, 0, doc.page.width, doc.page.height).stroke();
            doc.moveDown(2);
            doc.font('Helvetica-Bold').fontSize(40).fillColor('#101c4f').text('Unilever', { align: 'center' });
            doc.moveDown(0.5);
            doc.fontSize(20).fillColor('#64748b').text('Corporate Learning Certificate', { align: 'center' });
            doc.moveDown(2);
            doc.fontSize(16).fillColor('#1e293b').text('This is to certify that', { align: 'center' });
            doc.moveDown(1);
            doc.fontSize(30).fillColor('#1F36C7').text(attempt.user.name, { align: 'center' });
            doc.moveDown(1);
            doc.fontSize(16).fillColor('#1e293b').text('has successfully completed the assessment', { align: 'center' });
            doc.moveDown(0.5);
            doc.fontSize(24).font('Helvetica-Bold').text(attempt.quiz.title, { align: 'center' });
            doc.moveDown(4);
            const date = new Date(attempt.completedAt).toLocaleDateString();
            doc.fontSize(14).font('Helvetica').text(`Date: ${date}`, 100, 500);
            doc.text('Director of Learning', 600, 500);
            doc.moveTo(600, 490).lineTo(750, 490).stroke();
            doc.end();
        });
    }
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map