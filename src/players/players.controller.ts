import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Player } from './interfaces/players.interface';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  private readonly ackErrors: string[] = ['E11000'];
  private readonly logger = new Logger(PlayersController.name);
  constructor(private readonly playersService: PlayersService) {}

  @EventPattern('create-player')
  async create(@Payload() player: Player, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`${this.create.name} data: ${JSON.stringify(player)}`);

    try {
      await this.playersService.create(player);
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

  @MessagePattern('get-players')
  async get(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`${this.get.name} data: ${JSON.stringify(id)}`);

    try {
      if (id) return await this.playersService.getById(id);
      return await this.playersService.getAll();
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('update-player')
  async update(@Payload() payload: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const { id, player } = payload;

    this.logger.log(`${this.update.name} data: ${JSON.stringify(payload)}`);

    try {
      await this.playersService.update(id, player);
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

  @MessagePattern('delete-player')
  async delete(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`${this.delete.name} data: ${JSON.stringify(id)}`);

    try {
      return await this.playersService.delete(id);
    } finally {
      await channel.ack(originalMessage);
    }
  }
}
