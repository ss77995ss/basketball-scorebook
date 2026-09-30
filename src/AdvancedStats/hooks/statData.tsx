import { createContext, ReactNode, useContext, useReducer, ReactComponentElement } from 'react';
import { columns, initialData } from '../constants';
import { StatType } from '../types';

export type StatValueType = { count: number; points: number } | number | StatType['statInfo'];

type UpdateParamsType = {
  team: string;
  rowIndex: number;
  columnId: string;
  value: StatValueType;
};

type Action =
  | { type: 'UPDATE_CELL'; params: UpdateParamsType }
  | { type: 'UPDATE_STATS_NAME'; params: UpdateParamsType }
  | { type: 'RESET' };
type Dispatch = (action: Action) => void;
type State = { columns: typeof columns; home: Array<StatType>; away: Array<StatType> };
type StatsProviderProps = { children: ReactNode };

const StatsStateContext = createContext<State | undefined>(undefined);
const StatsDispatchContext = createContext<Dispatch | undefined>(undefined);

function statsReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'UPDATE_CELL': {
      const { team, rowIndex, columnId, value } = action.params;
      const prev = action.params.team === 'home' ? state.home : state.away;

      return {
        ...state,
        [team]: prev.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...prev[rowIndex],
              [columnId]: value,
            };
          }
          return row;
        }),
      };
    }
    case 'UPDATE_STATS_NAME': {
      const { rowIndex, columnId, value } = action.params;

      return {
        ...state,
        home: state.home.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...state.home[rowIndex],
              [columnId]: value,
            };
          }
          return row;
        }),
        away: state.away.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...state.away[rowIndex],
              [columnId]: value,
            };
          }
          return row;
        }),
      };
    }
    case 'RESET': {
      return { columns: columns, home: initialData, away: initialData };
    }
    default: {
      throw new Error('Unknown action type');
    }
  }
}

function StatsProvider({ children }: StatsProviderProps): ReactComponentElement<React.FC> {
  const [state, dispatch] = useReducer(statsReducer, { columns: columns, home: initialData, away: initialData });
  return (
    <StatsStateContext.Provider value={state}>
      <StatsDispatchContext.Provider value={dispatch}>{children}</StatsDispatchContext.Provider>
    </StatsStateContext.Provider>
  );
}

function useStatsState(): State {
  const context = useContext(StatsStateContext);
  if (context === undefined) {
    throw new Error('useStatsState must be used within a StatsProvider');
  }
  return context;
}

function useStatsDispatch(): Dispatch {
  const context = useContext(StatsDispatchContext);
  if (context === undefined) {
    throw new Error('useStatsDispatch must be used within a StatsProvider');
  }
  return context;
}
export { StatsProvider, useStatsState, useStatsDispatch };
