export const PERIODS = ['Q1', 'Q2', 'Q3', 'Q4', 'OT'] as const;

// code is the short prefix used in the possession log, e.g. "R/2分進/2"
export const DEFENSE_TYPES = {
  soft: { label: '盯人-soft', code: 'so' },
  yellow: { label: '盯人-yellow', code: 'Y' },
  red: { label: '盯人-red', code: 'R' },
  purple: { label: '盯人-purple', code: 'P' },
  open: { label: '區域-open', code: 'O' },
  lock: { label: '區域-lock', code: 'L' },
  spider: { label: '區域-spider', code: 'S' },
  fastBreak: { label: '被快攻', code: 'F' },
};

export const DEFENSE_KEYS = Object.keys(DEFENSE_TYPES) as Array<keyof typeof DEFENSE_TYPES>;

export const RESULTS = [
  { label: '2分進', points: 2 },
  { label: '2分不進', points: 0 },
  { label: '2分and1', points: 3 },
  { label: '3分進', points: 3 },
  { label: '3分不進', points: 0 },
  { label: '3分and1', points: 4 },
  { label: '罰球進0', points: 0 },
  { label: '罰球進1', points: 1 },
  { label: '罰球進2', points: 2 },
  { label: '罰球進3', points: 3 },
  { label: '失誤', points: 0 },
];
