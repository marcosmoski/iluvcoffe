import { Coffee } from 'src/coffees/entities/coffee.entity';
import { Flavor } from 'src/coffees/entities/flavor.entity';
import { CoffeeRefactor1724790241104 } from 'src/migration/1724790241104-CoffeeRefactor';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: [Coffee, Flavor],
  migrations: [CoffeeRefactor1724790241104],
});
