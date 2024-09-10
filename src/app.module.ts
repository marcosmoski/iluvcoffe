import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { CoffeesModule } from './coffees/coffees.module';
import { CommonModule } from './common/common.module';
import appConfig from './config/app.config';
import { DatabaseModule } from './database/database.module';
import { FlavorModule } from './flavors/flavor.module';

@Module({
  imports: [
    CoffeesModule,
    ConfigModule.forRoot({
      load: [appConfig],
      // validationSchema: Joi.object({
      //   DATABASE_HOST: Joi.required(),
      //   DATABASE_PORT: Joi.number().default(5433),
      //   DATABASE_USER: Joi.required(),
      //   DATABASE_PASSWORD: Joi.required(),
      //   DATABASE_NAME: Joi.required(),
      // }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: true, // disable on prod
      }),
    }),
    CoffeeRatingModule,
    DatabaseModule,
    CommonModule,
    FlavorModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}
