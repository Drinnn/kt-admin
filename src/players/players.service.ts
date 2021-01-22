import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from './interfaces/players.interface';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async create(player: Player): Promise<Player> {
    try {
      const createdPlayer = new this.playerModel(player);

      return await createdPlayer.save();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);

      throw new RpcException(err.message);
    }
  }

  async getAll(): Promise<Player[]> {
    try {
      return await this.playerModel.find().exec();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);

      throw new RpcException(err.message);
    }
  }

  async getById(_id: string): Promise<Player> {
    try {
      return await this.playerModel.findOne({ _id }).exec();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);

      throw new RpcException(err.message);
    }
  }

  async update(_id: string, player: Player): Promise<void> {
    try {
      await this.playerModel.findOneAndUpdate({ _id }, { $set: player }).exec();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);

      throw new RpcException(err.message);
    }
  }

  async delete(_id: string): Promise<void> {
    try {
      await this.playerModel.deleteOne({ _id });
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);

      throw new RpcException(err.message);
    }
  }
}
