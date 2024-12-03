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

export interface StoreContextProps {
  state: State;
  computed: ComputedProps;
  dispatch: Dispatch<Action>;
}

interface ComputedProps {
  aiReady: boolean;
  prompt: string;
  savedTab: SavedTab | null;
  folderTitleString: string;
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
    get folderTitleString(): string {
      return Object.keys(state.foldersByTitle).join(', ');
    },
    get savedTab(): CurrentTab['savedTab'] {
      return state.currentTab.savedTab;
    },
    get prompt(): string {
      return `
<url>${state.currentTab.preview.url}</url>
<title>${state.currentTab.preview.title}</title>
<folders>${this.folderTitleString}</folders>
<instruction>
  Select the most appropriate folder for the bookmark from the list. 
  Preferably choose one folder, but if the content strongly fits multiple, return up to three folders. 
  Output a comma-separated list of folder titles (e.g., "Folder1" or "Folder1, Folder2"). 
  Minimize the number of folders whenever possible. If no folder is suitable, return an empty string.
</instruction>
    `.trim();
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
