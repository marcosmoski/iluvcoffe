import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Patch,
  Post,
  Query,
  Scope,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { Protocol } from '@src/common/decorators/protocol.decorator';
import { Public } from '@src/common/decorators/public.decorator';
import { PaginationQueryDto } from '@src/common/dto/pagination-query.dto';
import { ParseIntPipe } from '@src/common/pipes/parse-int/parse-int.pipe';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable({ scope: Scope.DEFAULT })
@ApiTags('coffees')
@UsePipes(ValidationPipe)
@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  // @UsePipes(ValidationPipe)
  @ApiForbiddenResponse({ description: 'Forbiden' })
  @Get('')
  @Public()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    //await new Promise((resolve) => setTimeout(resolve, 5000));
    // const { limit, offset } = paginationQuery;
    return this.coffeesService.findAll(paginationQuery);
    //return `This action returns all coffes. Limit: ${limit} Offset: ${offset} `;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string, @Protocol('https') protocol) {
    console.log(protocol);
    return this.coffeesService.findOne(id);
  }

  @Get('flavors/:id')
  findCoffeeFlavor(@Param('id') id: string) {
    console.log('ID OF FFLAVOR - ' + id);
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    console.log(createCoffeeDto instanceof CreateCoffeeDto);
    return this.coffeesService.create(createCoffeeDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto,
  ) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(id);
  }
}
