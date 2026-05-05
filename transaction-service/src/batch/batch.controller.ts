import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { BatchService } from './batch.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { BatchListQueryDto } from './dto/batch-list-query.dto';
import { TransactionListQueryDto } from './dto/transaction-list-query.dto';

@Controller('batches')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBatchDto: CreateBatchDto) {
    return this.batchService.create(createBatchDto);
  }

  @Get()
  async findAll(@Query() query: BatchListQueryDto) {
    return this.batchService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.batchService.findById(id);
  }

  @Get(':id/transactions')
  async findTransactions(
    @Param('id') id: string,
    @Query() query: TransactionListQueryDto,
  ) {
    return this.batchService.findTransactionsByBatchId(id, query);
  }
}
