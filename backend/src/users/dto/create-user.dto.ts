export class CreateUserDto {
    email: string;
    name: string;
    password: string; // Required
    role?: string;
    department?: string;
}
