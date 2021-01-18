import { Document } from 'mongoose';
import { Player } from '../players/players.interface';

export interface Category extends Document {
  readonly name: string;
  description: string;
  events: Array<Event>;
  players: Array<Player>;
}

export interface Event {
  name: string;
  operation: string;
  value: number;
}
