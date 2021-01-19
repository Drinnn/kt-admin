import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Category } from './interfaces/categories/categories.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @EventPattern('create-category')
  async createCategory(@Payload() category: Category) {
    await this.appService.createCategory(category);
  }
}
