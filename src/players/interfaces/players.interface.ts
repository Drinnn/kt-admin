import { Document } from 'mongoose';
import { Category } from 'src/categories/interfaces/categories.interface';

export interface Player extends Document {
  readonly phoneNumber: string;
  readonly email: string;
  name: string;
  category: Category;
  ranking: string;
  rankingPosition: number;
  avatarUrl: string;
}
