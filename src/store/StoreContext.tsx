import React, {
  createContext,
  useReducer,
  ReactNode,
  Dispatch,
  useContext,
} from 'react';

import { reducer, INITIAL_STATE, Action, State, ComputedProps } from './Store';
import { CurrentTab } from '../types/CurrentTab';
import { SavedTab } from '../types/SavedTab';
import { PromptPayload } from '../types/PromptPayload';

export interface StoreContextProps {
  state: State;
  computed: ComputedProps;
  dispatch: Dispatch<Action>;
}

interface ComputedProps {
  aiReady: boolean;
  folderListString: string;
  promptPayload: PromptPayload;
  savedTab: SavedTab | null;
}

const StoreContext = createContext<StoreContextProps>({} as StoreContextProps);

const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const computed: ComputedProps = {
    get aiReady(): boolean {
      return (
        state.aiCapabilities !== null &&
        state.aiCapabilities !== 'unsupported' &&
        state.aiCapabilities.available === 'readily'
      );
    },
    get folderListString(): string {
      return Object.keys(state.foldersByTitle).join(', ');
    },
    get savedTab(): CurrentTab['savedTab'] {
      return state.currentTab.savedTab;
    },
    get promptPayload(): PromptPayload {
      return {
        url: state.currentTab.preview.url,
        title: state.currentTab.preview.title,
        folderListString: this.folderListString,
      };
    },
  };

  return (
    <StoreContext.Provider value={{ state, computed, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

const useStoreContext = () => {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }

  return context;
};

export { StoreProvider, useStoreContext };
