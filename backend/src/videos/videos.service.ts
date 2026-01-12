import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) { }

  create(createVideoDto: CreateVideoDto) {
    return this.prisma.video.create({
      data: {
        title: createVideoDto.title,
        description: createVideoDto.description,
        url: createVideoDto.url,
        duration: createVideoDto.duration
      }
    });
  }

  findAll() {
    return this.prisma.video.findMany();
  }

  findOne(id: string) {
    return this.prisma.video.findUnique({ where: { id } });
  }

  update(id: string, updateVideoDto: UpdateVideoDto) {
    return this.prisma.video.update({
      where: { id },
      data: updateVideoDto
    });
  }

  remove(id: string) {
    return this.prisma.video.delete({ where: { id } });
  }
}
