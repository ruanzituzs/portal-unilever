import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() req: any) {
    // In a real app use LocalAuthGuard
    // Here we assume req body has email and password
    // Validate user first
    const user = await this.authService.validateUser(req.email, req.password);
    if (!user) {
      return { error: 'Invalid credentials' };
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
