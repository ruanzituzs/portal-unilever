import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        // password should be hashed in AuthService or here. 
        // For simplicity, we assume AuthService handles hashing or we do it here.
        // Let's rely on AuthService calling a dedicated method or passing hashed password.
        // But better: create method here takes plain password, hashes it. 
        // I will keep it simple: Controller/AuthService will hash.
      }
    });
  }

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}

