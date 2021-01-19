import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { Category } from './interfaces/categories/categories.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @EventPattern('create-category')
  async createCategory(
    @Payload() category: Category,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(
      `${this.createCategory.name} data: ${JSON.stringify(category)}`,
    );

    try {
      await this.appService.createCategory(category);
      await channel.ack(originalMessage);
    } catch (err) {
      this.logger.error(
        `${this.createCategory.name} error: ${JSON.stringify(err.message)}`,
      );
      ackErrors.map(async (ackErr) => {
        if (err.message.includes(ackErr)) {
          await channel.ack(originalMessage);
        }
      });
    }
  }

  @MessagePattern('get-categories')
  async getCategories(@Payload() categoryId: string) {
    if (categoryId) return await this.appService.getCategoryById(categoryId);

    return await this.appService.getAllCategories();
  }
}
