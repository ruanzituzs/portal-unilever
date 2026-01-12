import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    }),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(mp4|webm|ogg)$/)) {
        return callback(new BadRequestException('Only video files are allowed!'), false);
      }
      callback(null, true);
    }
  }))
  create(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Convert body to DTO manually because of multipart/form-data
    const createVideoDto: CreateVideoDto = {
      title: body.title,
      description: body.description,
      url: `/uploads/${file.filename}`, // Save relative path
      duration: Number(body.duration) || 0
    };

    return this.videosService.create(createVideoDto);
  }

  @Get()
  findAll() {
    return this.videosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videosService.remove(id);
  }
}
