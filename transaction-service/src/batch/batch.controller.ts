import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { BatchService } from './batch.service';
import { CreateBatchDto } from './dto/create-batch.dto';

@Controller('batches')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBatchDto: CreateBatchDto) {
    return this.batchService.create(createBatchDto);
  }
}
