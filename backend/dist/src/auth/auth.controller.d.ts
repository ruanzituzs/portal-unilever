import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
    } | {
        error: string;
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        password: string;
        name: string;
        role: string;
        department: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
