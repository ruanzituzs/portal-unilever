const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({
            select: {
                email: true,
                role: true,
                name: true
            }
        });
        console.log('--- USERS IN DB ---');
        console.table(users);

        const managers = users.filter(u => u.role === 'MANAGER');
        if (managers.length === 0) {
            console.log('WARNING: No MANAGER user found!');
        } else {
            console.log('Managers found:', managers.map(m => m.email).join(', '));
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
