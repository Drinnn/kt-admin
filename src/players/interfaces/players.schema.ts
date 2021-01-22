import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    phoneNumber: { type: String },
    name: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    ranking: { type: String },
    rankingPosition: { type: Number },
    avatarUrl: { type: String },
  },
  { timestamps: true, collection: 'players' },
);
