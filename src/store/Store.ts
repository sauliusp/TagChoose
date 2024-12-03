import { AiCapabilities } from '../types/AiCapabilities';
import { CurrentTab } from '../types/CurrentTab';
import { Folder } from '../types/Folder';
import { SavedTab } from '../types/SavedTab';
import { TabPreview } from '../types/TabPreview';

export enum ActionType {
  SelectFolders = 'SelectFolders',
  SetAiCapabilities = 'SetAiCapabilities',
  SetAiSuggestion = 'SetAiSuggestion',
  SetCurrentTab = 'SetCurrentTab',
  SetFolders = 'SetFolders',
  SetUiState = 'SetUiState',
  UpdateTabTitle = 'UpdateTabTitle',
}

export type Action =
  | { type: ActionType.SelectFolders; payload: Folder['id'][] }
  | { type: ActionType.SetAiCapabilities; payload: AiCapabilities }
  | { type: ActionType.SetAiSuggestion; payload: string }
  | {
      type: ActionType.SetCurrentTab;
      payload: { tabPreview: TabPreview; savedTab: SavedTab | null };
    }
  | { type: ActionType.SetFolders; payload: Folder[] }
  | { type: ActionType.SetUiState; payload: UiState }
  | { type: ActionType.UpdateTabTitle; payload: string };

export enum UiState {
  Upload = 'upload',
}

export interface State {
  aiCapabilities: AiCapabilities | null;
  aiResponse: string | null;
  allFolderIds: Folder['id'][];
  currentTab: CurrentTab;
  foldersById: Record<Folder['id'], Folder>;
  foldersByTitle: Record<Folder['title'], Folder>;
  suggestedFolderIds: Array<Folder['id']>;
  selectedFolderIds: Array<Folder['id']>;
  uiState: UiState;
}

export const INITIAL_STATE: State = {
  aiCapabilities: null,
  aiResponse: null,
  allFolderIds: [],
  currentTab: {
    folders: [],
    preview: {
      faviconUrl: '',
      title: '',
      url: '',
    },
    savedTab: null,
    title: '',
  },
  foldersById: {},
  foldersByTitle: {},
  suggestedFolderIds: [],
  selectedFolderIds: [],
  uiState: UiState.Upload,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.SetUiState:
      return { ...state, uiState: action.payload };
    case ActionType.SetCurrentTab: {
      const { savedTab, tabPreview } = action.payload;

      return {
        ...state,
        currentTab: {
          title: savedTab ? savedTab.bookmark.title : tabPreview.title,
          folders: savedTab ? savedTab.folders : [],
          preview: tabPreview,
          savedTab,
        },
      };
    }
    case ActionType.UpdateTabTitle:
      return {
        ...state,
        currentTab: { ...state.currentTab, title: action.payload },
      };
    case ActionType.SetFolders: {
      const { foldersById, foldersByTitle, selectedFolderIds, allFolderIds } =
        action.payload.reduce(
          (result, folder) => ({
            ...result,
            foldersById: { ...result.foldersById, [folder.id]: folder },
            foldersByTitle: {
              ...result.foldersByTitle,
              [folder.title]: folder,
            },
            allFolderIds: [...result.allFolderIds, folder.id],
          }),
          {
            allFolderIds: [],
            foldersById: {},
            foldersByTitle: {},
            selectedFolderIds: [],
          } as {
            allFolderIds: State['allFolderIds'];
            foldersById: State['foldersById'];
            foldersByTitle: State['foldersByTitle'];
            selectedFolderIds: State['selectedFolderIds'];
          },
        );

      return {
        ...state,
        foldersById,
        foldersByTitle,
        selectedFolderIds,
        allFolderIds,
      };
    }
    case ActionType.SelectFolders:
      return {
        ...state,
        selectedFolderIds: action.payload,
      };
    case ActionType.SetAiCapabilities:
      return {
        ...state,
        aiCapabilities: action.payload,
      };
    case ActionType.SetAiSuggestion: {
      const aiResponse = action.payload;

      if (!aiResponse) {
        return {
          ...state,
          aiResponse,
          suggestedFolderIds: [],
        };
      }

      const folderTitles = aiResponse.split(',').map((title) => title.trim());

      const suggestedFolderIds = Array.from(
        new Set([
          ...state.suggestedFolderIds,
          ...folderTitles
            .filter((title) => state.foldersByTitle[title])
            .map((title) => state.foldersByTitle[title].id),
        ]),
      );

      const selectedFolderIds = Array.from(
        new Set([...suggestedFolderIds, ...state.selectedFolderIds]),
      );

      return {
        ...state,
        aiResponse,
        suggestedFolderIds,
        selectedFolderIds,
      };
    }
    default:
      throw new Error('Unknown action');
  }
}
