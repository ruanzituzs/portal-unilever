import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        password: string;
        name: string;
        role: string;
        department: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
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
    findOne(id: string): Promise<{
        id: string;
        email: string;
        password: string;
        name: string;
        role: string;
        department: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
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
