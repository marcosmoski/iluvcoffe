import { DynamicModule, Module } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({})

// Creating static register() method on DatabaseModule
// export class DatabaseModule {
//   static register(options: DataSourceOptions): DynamicModule {}
// }

// Improved Dynamic Module way of creating CONNECTION provider
export class DatabaseModule {
  static register(options: DataSourceOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'CONNECTION',
          useValue: new DataSource(options),
        },
      ],
    };
  }
}

/*
  👉👉👉 NOTE: If you are following along with this course and going to keep this dynamic module...
  
  ⭐⭐⭐⭐ ️️Make sure you pass in "username" and "password".
*/

// Utilizing the dynamic DatabaseModule in another Modules imports: []
// imports: [
//   DatabaseModule.register({
//     // 👈 passing in dynamic values
//     type: 'postgres',
//     host: 'localhost',
//     // 👇👇👇👇 Make sure these are included 👇👇👇
//     // 👇👇👇👇 Make sure these are included 👇👇👇
//     // 👇👇👇👇 Make sure these are included 👇👇👇
//     username: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD,
//   }),
// ];
