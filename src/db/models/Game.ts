import mongoose from "mongoose";
import User, { UserSchema } from "./User";

const now = Date.now();

const GameSchema: mongoose.Schema = new mongoose.Schema({
  status: {
    game: { type: Number, min: 0, max: 2, default: 0 },
    playerOne: { type: Number, min: 0, max: 2, default: 0 },
    playerTwo: { type: Number, min: 0, max: 2, default: 0 },
  },
  players: {
    one: { type: mongoose.Types.ObjectId },
    two: { type: mongoose.Types.ObjectId },
  },
  board: {
    size: { type: Number, min: 8, max: 12, default: 10 },
    state: [[Number]],
  },
  turn: { type: Number, min: 0, max: 1, default: 0 },
});

export default mongoose.model("Game", GameSchema);
