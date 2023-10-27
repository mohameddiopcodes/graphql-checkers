import { GraphQLError } from "graphql";
import Game from "../models/Game";
import User from "../models/User";
import generateRow from "src/utils/checkeredRow";
import computePossibleMoves from "src/utils/computePossibleMoves";

export { createGame, flipGameStatus, listGames, connectGame, performGameLogic };

async function createGame(req: any, res: any, args: any) {
  const { opponentId, boardSize } = args;
  const opponent = await User.findById(opponentId);
  if (req.user.id === opponentId) throw new GraphQLError("Bad request.");
  if (opponentId && !opponent) throw new GraphQLError("Opponent not found.");

  const previousGame = await Game.findOne({
    "players.one": { $in: [req.user.id, opponentId] },
    "players.two": { $in: [req.user.id, opponentId] },
  });

  if (previousGame) throw new GraphQLError("Game already started.");
  //create game
  const game = new Game();
  game.players = { one: req.user.id, two: opponentId };
  if (boardSize) game.board.size = boardSize;
  for (let i = 0; i < game.board.size; i++) {
    game.board.state.push(generateRow(i, game.board.size));
  }
  game.save();

  //push game
  opponent?.games.push(game);
  await opponent?.save();
  req.user.games.push(game);
  await req.user.save;

  return {
    players: game.players,
    board: game.board,
    status: game.status,
    turn: game.turn,
    id: game.id,
  };
}

async function flipGameStatus(req: any, res: any, args: any, pubsub: any) {
  const { gameId } = args;
  const game = await Game.findById(gameId);
  if (!game) throw new GraphQLError("Game not found.");

  if (
    !game.players.one.equals(req.user.id) &&
    (!game.players.two?.equals(req.user.id) || !game.players.two)
  )
    throw new GraphQLError("Bad request.");

  const player =
    "player" + (game.players.one.equals(req.user.id) ? "One" : "Two");

  game.status = {
    ...game.status,
    [player]: 1,
  };

  if (
    game.status.playerOne &&
    (game.status.playerOne === game.status.playerTwo || !game.players.two)
  ) {
    game.status.game = 1;
    game.status.playerOne = 1;
    game.status.playerTwo = 1;
  }

  await game.save();

  pubsub.publish(gameId, {
    status: game.status,
  });

  return game.status;
}

//play here

async function listGames(req: any, res: any, args: any) {
  const { player } = args;
  const filters = [];
  switch (player) {
    case 1:
      filters.push({ "players.one": req.user.id });
      break;
    case 2:
      filters.push({ "players.two": req.user.id });
      break;
    default:
      filters.push({ "players.one": req.user.id });
      filters.push({ "players.two": req.user.id });
  }

  const games = await Game.find({ $or: filters });

  return games.map((g) => ({
    players: g.players,
    board: g.board,
    status: g.status,
    turn: g.turn,
    id: g.id,
  }));
}

async function connectGame(req: any, res: any, args: any) {
  const { gameId } = args;
  const game = await Game.findById(gameId);
  if (!game) throw new GraphQLError("Game not found.");
  if (
    !game.players.one.equals(req.user.id) &&
    !game.players.two.equals(req.user.id)
  ) {
    throw new GraphQLError("Bad request.");
  }
}

async function performGameLogic(req: any, res: any, args: any, pubsub: any) {
  const { gameId, start, end } = args;
  const game = await Game.findById(gameId);
  if (!game) throw new GraphQLError("Game not found.");
  if (
    !game.players.one.equals(req.user.id) &&
    !game.players.two.equals(req.user.id)
  ) {
    throw new GraphQLError("Bad request.");
  }
  //logic
  const chip = game.board.state[start.x][start.y];
  const wrongTurn =
    (game.turn === 0 && !game.players.one.equals(req.user.id)) ||
    (game.turn === 1 && !game.players.two.equals(req.user.id));
  const possibleMoves = computePossibleMoves(
    game.board.size,
    game.board.state,
    start
  );
  const sameChip = chip && game.board.state[end.x][end.y] === game.turn + 1;
  const moveAllowed =
    possibleMoves.some(
      (move) => move && move[0] === end.x && move[1] === end.y
    ) || sameChip;

  if (!chip) throw new GraphQLError("Invalid chip.");
  if (wrongTurn)
    throw new GraphQLError("Wait for your opponent to make a move.");
  if (!moveAllowed) throw new GraphQLError("Move not allowed.");
  //if opponent then CAPTURE
  if (!sameChip) {
    const orientationX = start.x - end.x < 0 ? 1 : -1;
    const orientationY = start.y - end.y < 0 ? 1 : -1;
    //move to capture cell
    game.board.state[end.x][end.y] = game.board.state[start.x][start.y];
    game.board.state[start.x][start.y] = null;
    //view possible moves
    const possibleMoves = computePossibleMoves(
      game.board.size,
      game.board.state,
      end
    );
    //jump
    const jump = possibleMoves.find(
      (m) => m && m[0] === end.x + orientationX && m[1] === end.y + orientationY
    );
    if (jump) {
      //move out of capture cell
      game.board.state[jump[0]][jump[1]] = game.board.state[end.x][end.y];
      game.board.state[end.x][end.y] = null;
      end.x = jump[0];
      end.y = jump[1];
    }
  } else {
    game.board.state[end.x][end.y] = game.board.state[start.x][start.y];
    game.board.state[start.x][start.y] = null;
  }
  game.turn = game.turn ? 0 : 1;
  game.save();

  pubsub.publish(gameId, {
    move: {
      start,
      end,
    },
  });

  const event = {
    move: {
      start,
      end,
    },
  };
  return event;
}
