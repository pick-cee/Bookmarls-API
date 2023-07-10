import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {

    constructor(private bookmarkService: BookmarkService){}

    @Post()
    createBookmark(@GetUser('email') email: string, @Body() dto: CreateBookmarkDto){
        return this.bookmarkService.createBookmark(email, dto)
    }

    @Get()
    getBookmarks(@GetUser('email') email: string){
        return this.bookmarkService.getBookmarks(email)
    }

    @Get(':id')
    getBookmarkById(@GetUser('email') email: string, @Param('id', ParseIntPipe) bookmarkId: number){
        return this.bookmarkService.getBookmarkById(email, bookmarkId)
    }

    @Patch(':id')
    editBookmarkById(@GetUser('email') email: string, @Param('id', ParseIntPipe) bookmarkId: number,@Body() dto: EditBookmarkDto){
        return this.bookmarkService.editBookmarkById(email,bookmarkId, dto)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteBookmarkById(@GetUser('email') userEmail: string, @Param('id', ParseIntPipe) bookmarkId: number){
        return this.bookmarkService.deleteBookmarkById(userEmail, bookmarkId)
    }
}
