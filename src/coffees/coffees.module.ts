import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import coffeesConfig from './config/coffees.config';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
    ConfigModule.forFeature(coffeesConfig),
  ],
  controllers: [CoffeesController],
  providers: [CoffeesService],
  // class providers providers: []
  // non class based  providers:
  // providers: [
  //   CoffeesService,
  //   { provide: COFFEE_BRANDS, useValue: ['buddy new', 'nescafe'] },
  // ],
  // class provider
  //   {
  //        provide: ConfigService
  //        useClass: process.env.NODE_ENV === 'dev' ? DevelopmentConfigService : ProdConfigService
  //   }

  // factory providers
  // providers: [
  //   CoffeesService,
  //   CoffeeBrandsFactory,
  //   { provide: COFFEE_BRANDS, useFactory: (brandsFactory) => brandsFactory.create(), inject: [CoffeeBrandsFactory] },
  // ],

  // leverage async providers for exemple wait connection for db
  // factory returns a promise then nest will wait the resolution for it
  // Asynchronous "useFactory" (async provider example)
  // {
  //   provide: 'COFFEE_BRANDS',
  //   // Note "async" here, and Promise/Async event inside the Factory function
  //   // Could be a database connection / API call / etc
  //   // In our case we're just "mocking" this type of event with a Promise
  //   useFactory: async (connection: Connection): Promise<string[]> => {
  //     // const coffeeBrands = await connection.query('SELECT * ...');
  //     const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe'])
  //     return coffeeBrands;
  //   },
  //   inject: [Connection],
  // },

  // use value provider
  // providers: [{ provide: CoffeesService, useClass: MockCoffeesService }],

  exports: [CoffeesService],
})
export class CoffeesModule {}
