import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Create Admin account
    const adminPassword = await bcrypt.hash('admin2024', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@unilever.com' },
        update: {},
        create: {
            email: 'admin@unilever.com',
            name: 'Administrador',
            password: adminPassword,
            role: 'MANAGER',
            department: 'Gestão'
        },
    });

    // Create Employee account
    const employeePassword = await bcrypt.hash('funcionario2024', 10);
    const employee = await prisma.user.upsert({
        where: { email: 'funcionario@unilever.com' },
        update: {},
        create: {
            email: 'funcionario@unilever.com',
            name: 'Colaborador Teste',
            password: employeePassword,
            role: 'EMPLOYEE',
            department: 'Vendas'
        },
    });

    console.log('✅ Usuários criados com sucesso!');
    console.log('📋 Admin:', { email: admin.email, senha: 'admin2024' });
    console.log('👤 Funcionário:', { email: employee.email, senha: 'funcionario2024' });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
