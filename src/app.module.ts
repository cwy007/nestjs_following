import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authPlugins } from 'mysql2';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "Cwy17824",
      database: "following_test",
      synchronize: true,
      logging: true,
      entities: [User],
      poolSize: 10,
      extra: {
        authPlugin: {
          sha256_password: authPlugins.sha256_password,
        },
      }
    }),
    UserModule,
    RedisModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
