import mongoose from "mongoose";
import Game from "./Game";
import Access from "./Access";

export const UserSchema: mongoose.Schema = new mongoose.Schema({
  name: { type: String, maxLength: 50 },
  email: { type: String, maxLength: 100 },
  profilePicture: String,
  password: { type: String, maxLength: 100 },
  age: Number,
  accesses: [Access.schema],
  games: [Game.schema],
});

UserSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function (doc, next) {
    doc.accesses.forEach(async (access: any) => {
      await Access.findByIdAndDelete(access.id);
    });
    doc.games.forEach(async (game: any) => {
      await Game.findByIdAndDelete(game.id);
    });
    next();
  }
);

export default mongoose.model("User", UserSchema);
