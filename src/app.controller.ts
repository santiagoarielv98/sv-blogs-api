import { Controller } from '@nestjs/common';

// const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
@Controller()
export class AppController {
  // constructor(private readonly fileService: FileService) {}
  // @Post('/file')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
  //         new MaxFileSizeValidator({
  //           maxSize: MAX_FILE_SIZE, // 10MB
  //           message: 'File is too large. Max file size is 10MB',
  //         }),
  //       ],
  //       fileIsRequired: true,
  //     }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   return this.fileService.uploadFile(file);
  // }
}
