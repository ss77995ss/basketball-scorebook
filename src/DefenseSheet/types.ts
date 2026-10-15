import { DEFENSE_KEYS, PERIODS } from './constants';

export type Period = (typeof PERIODS)[number];
export type DefenseKey = (typeof DEFENSE_KEYS)[number];

export type Possession = {
  period: Period;
  defense: DefenseKey;
  result: string;
  // stored rather than looked up from RESULT_GROUPS so saved games never change if the table does
  points: number;
  contested: boolean;
};

export type Game = {
  id: string;
  name: string;
  createdAt: string;
  // optional: games saved before this field existed don't have it
  updatedAt?: string;
  possessions: Possession[];
};
