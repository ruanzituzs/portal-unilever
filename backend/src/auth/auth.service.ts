import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id, role: user.role, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userDto: any) {
    let role = 'EMPLOYEE';

    // Security Check: Access Code
    if (userDto.accessCode === 'UNILEVER_ADMIN_2024') {
      role = 'MANAGER';
    } else if (userDto.accessCode === 'UNILEVER2024') {
      role = 'EMPLOYEE';
    } else {
      throw new Error('Código de Acesso Inválido');
    }

    // Remove accessCode from data to be saved
    const { accessCode, ...userData } = userDto;

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return this.usersService.create({
      ...userData,
      password: hashedPassword,
      role: role // Assign determined role
    });
  }
}
