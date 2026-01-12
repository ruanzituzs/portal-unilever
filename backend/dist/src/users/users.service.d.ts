import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findOne(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string;
        password: string;
        name: string;
        role: string;
        department: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    update(id: string, updateUserDto: UpdateUserDto): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        password: string;
        name: string;
        role: string;
        department: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        password: string;
        name: string;
        role: string;
        department: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
