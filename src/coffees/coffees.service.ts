import { Inject, NotFoundException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { DataSource, Repository } from 'typeorm';
import { Event } from '../events/entities/event.entity';
import coffeesConfig from './config/coffees.config';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    @Inject(coffeesConfig.KEY)
    private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,
    // non class based provider @Inject('COFFEE_BRANDS') coffeeBrands: string[],
  ) {
    // console.log('Coffeservice');
    const dbHost = this.coffeesConfiguration.foo;
    console.log(dbHost);
  }

  findAll(paginationQuery: PaginationQueryDto) {
    return this.coffeeRepository.find({
      relations: { flavors: true },
      skip: paginationQuery.offset,
      take: paginationQuery.limit,
    });
  }

  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id: +id },
      relations: { flavors: true },
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );
    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeDto.flavors &&
      (await Promise.all(
        updateCoffeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      ));
    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeDto,
      flavors,
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return this.coffeeRepository.save(coffee);
  }

  async remove(id: string) {
    const coffee = await this.coffeeRepository.findOne({ where: { id: +id } });
    return this.coffeeRepository.remove(coffee);
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({
      where: { name },
    });
    if (existingFlavor) {
      return existingFlavor;
    }

    return this.flavorRepository.create({ name });
  }

  async recommendCoffe(coffee: Coffee) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations++;

      const reccomendEvent = new Event();
      reccomendEvent.name = 'recommend_coffee';
      reccomendEvent.type = 'coffee';
      reccomendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(reccomendEvent);
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
