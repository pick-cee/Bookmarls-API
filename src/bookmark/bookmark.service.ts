import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
    constructor(private prismaServie: PrismaService){}

    async createBookmark(email: string, dto: CreateBookmarkDto,) {
        console.log(email)
        const bookmark = await this.prismaServie.bookmark.create({
            data: {
              ...dto,
              user: { connect: { email: email } },
            },
          });
    
        return bookmark
      }

    getBookmarks(userId: number){
        console.log(userId)
        return this.prismaServie.bookmark.findMany({
            where: {userId}
        })
    }

    getBookmarkById(userId: number, bookmarkId: number){}

    editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto){}

    deleteBookmarkById(userId: number, bookmarkId: number){}
}
