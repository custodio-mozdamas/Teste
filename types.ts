
export enum PieceColor {
  WHITE = 'WHITE',
  RED = 'RED'
}

export enum PieceType {
  MAN = 'MAN',
  KING = 'KING'
}

export interface Piece {
  id: string;
  color: PieceColor;
  type: PieceType;
  row: number;
  col: number;
}

export interface Move {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  captures?: Piece[];
}

export enum RoomType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export enum GameStatus {
  WAITING = 'WAITING',
  READY = 'READY',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  status: GameStatus;
  players: Player[];
  spectators: number;
  timeLimit: number; // minutes
  increment: number; // seconds
  theme: BoardTheme;
}

export interface Player {
  id: string;
  name: string;
  rating: number;
  color?: PieceColor;
  ready: boolean;
  timeLeft: number; // milliseconds
}

export enum BoardTheme {
  WOOD = 'WOOD',
  DARK = 'DARK',
  GREEN = 'GREEN',
  MINIMAL = 'MINIMAL'
}

export enum AppTab {
  HOME = 'HOME',
  RANKING = 'RANKING',
  PROFILE = 'PROFILE',
  GAME = 'GAME'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  matches: number;
  wins: number;
}
