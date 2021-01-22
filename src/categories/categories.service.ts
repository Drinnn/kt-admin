import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interfaces/categories.interface';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  async create(category: Category): Promise<Category> {
    try {
      const createdCategory = new this.categoryModel(category);

      return await createdCategory.save();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);

      throw new RpcException(err.message);
    }
  }

  async getAll(): Promise<Category[]> {
    try {
      return await this.categoryModel.find().populate('players').exec();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);

      throw new RpcException(err.message);
    }
  }

  async getById(_id: string): Promise<Category> {
    try {
      return await this.categoryModel
        .findOne({ _id })
        .populate('players')
        .exec();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);

      throw new RpcException(err.message);
    }
  }

  async update(name: string, category: Category): Promise<void> {
    try {
      await this.categoryModel
        .findOneAndUpdate({ name }, { $set: category })
        .exec();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);

      throw new RpcException(err.message);
    }
  }
}
