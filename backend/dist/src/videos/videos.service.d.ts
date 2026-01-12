import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { PrismaService } from '../prisma.service';
export declare class VideosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createVideoDto: CreateVideoDto): import(".prisma/client").Prisma.Prisma__VideoClient<{
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
