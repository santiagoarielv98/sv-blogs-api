import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    ...((process.env.NODE_ENV === 'production' && {
      ssl: { rejectUnauthorized: false },
      url: process.env.DB_URL,
    }) || {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    }),
    autoLoadEntities: true,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    // logging: true,
    // synchronize: process.env.NODE_ENV !== 'production',
    // dropSchema: true,
  }),
);
