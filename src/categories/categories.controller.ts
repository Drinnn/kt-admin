import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { Category } from './interfaces/categories.interface';

@Controller('categories')
export class CategoriesController {
  private readonly ackErrors: string[] = ['E11000'];
  private readonly logger = new Logger(CategoriesController.name);
  constructor(private readonly categoriesService: CategoriesService) {}

  @EventPattern('create-category')
  async create(@Payload() category: Category, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`${this.create.name} data: ${JSON.stringify(category)}`);

    try {
      await this.categoriesService.create(category);
      await channel.ack(originalMessage);
    } catch (err) {
      this.logger.error(
        `${this.create.name} error: ${JSON.stringify(err.message)}`,
      );
      this.ackErrors.map(async (ackErr) => {
        if (err.message.includes(ackErr)) {
          await channel.ack(originalMessage);
        }
      });
    }
  }

  @MessagePattern('get-categories')
  async get(@Payload() categoryId: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`${this.get.name} data: ${JSON.stringify(categoryId)}`);

    try {
      if (categoryId) return await this.categoriesService.getById(categoryId);
      return await this.categoriesService.getAll();
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('update-category')
  async update(@Payload() payload: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const { name, category } = payload;

    this.logger.log(`${this.update.name} data: ${JSON.stringify(payload)}`);

    try {
      await this.categoriesService.update(name, category);
      await channel.ack(originalMessage);
    } catch (err) {
      this.logger.error(
        `${this.update.name} error: ${JSON.stringify(err.message)}`,
      );
      this.ackErrors.map(async (ackErr) => {
        if (err.message.includes(ackErr)) {
          await channel.ack(originalMessage);
        }
      });
    }
  }
}
