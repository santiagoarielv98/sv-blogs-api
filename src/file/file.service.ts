import { BadRequestException, Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { extname } from 'node:path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  private s3Client: S3Client;
  private bucketName = this.configService.get('S3_BUCKET_NAME');

  constructor(private configService: ConfigService) {
    const s3_region = this.configService.get('S3_REGION');
    const s3_access_key = this.configService.get('S3_ACCESS_KEY');
    const s3_secret_access_key = this.configService.get('S3_SECRET_ACCESS_KEY');

    if (!s3_region) {
      throw new Error('S3_REGION not found in environment variables');
    }

    this.s3Client = new S3Client({
      region: s3_region,
      credentials: {
        accessKeyId: s3_access_key,
        secretAccessKey: s3_secret_access_key,
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'images',
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const fileExtension = extname(file.originalname);
    const key = `${folder}/${uuidv4()}${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
  }
}
