import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
    constructor(private prismaServie: PrismaService){}

    async createBookmark(email: string, dto: CreateBookmarkDto,) {
        const bookmark = await this.prismaServie.bookmark.create({
            data: {
              ...dto,
              user: { connect: { email: email } },
            },
          });
    
        return bookmark
      }

    getBookmarks(userEmail: string){
          return this.prismaServie.bookmark.findMany({
            where: {userEmail}
        })
    }

    getBookmarkById(userEmail: string, bookmarkId: number){
        return this.prismaServie.bookmark.findFirst({
          where: { id: bookmarkId, userEmail}
        })
    }

    async editBookmarkById(userEmail: string, bookmarkId: number, dto: EditBookmarkDto){
      const bookmark = await this.prismaServie.bookmark.findFirst({
        where: { id: bookmarkId }
      })
      if(!bookmark || bookmark.userEmail !== userEmail){
        throw new ForbiddenException('Access to resource denied')
      }
      return this.prismaServie.bookmark.update({
        where: {
          id: bookmarkId
        },
        data: {
          ...dto
        }
      })
    }

    async deleteBookmarkById(userEmail: string, bookmarkId: number){
      const bookmark = await this.prismaServie.bookmark.findFirst({
        where: {id: bookmarkId}
      })
      if(!bookmark || bookmark.userEmail !== userEmail){
        throw new ForbiddenException('Access to resource denied')
      }

      await this.prismaServie.bookmark.delete({
        where: {
          id: bookmarkId
        }
      })
    }
}
