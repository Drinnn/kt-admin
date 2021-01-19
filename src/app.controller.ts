import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
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

  @MessagePattern('get-categories')
  async getCategories(@Payload() categoryId: string) {
    if (categoryId) return await this.appService.getCategoryById(categoryId);

    return await this.appService.getAllCategories();
  }
}
