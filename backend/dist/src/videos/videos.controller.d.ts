import { VideosService } from './videos.service';
import { UpdateVideoDto } from './dto/update-video.dto';
export declare class VideosController {
    private readonly videosService;
    constructor(videosService: VideosService);
    create(file: Express.Multer.File, body: any): import(".prisma/client").Prisma.Prisma__VideoClient<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        url: string;
        duration: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        url: string;
        duration: number;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__VideoClient<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        url: string;
        duration: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateVideoDto: UpdateVideoDto): import(".prisma/client").Prisma.Prisma__VideoClient<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        url: string;
        duration: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__VideoClient<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        url: string;
        duration: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
