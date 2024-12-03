import React, { useEffect, useState } from 'react';
import {
  TextField,
  Autocomplete,
  Chip,
  LinearProgress,
  Paper,
  Fab,
  Box,
} from '@mui/material';
import { useStoreContext } from '../store/StoreContext';
import { bookmarkService } from '../services/bookmarkService';
import { aiService } from '../services/AiService';
import { ActionType } from '../store/Store';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Folder } from '../types/Folder';
import { PromptPayload } from '../types/PromptPayload';

export const TagSelect: React.FC = () => {
  const { state, computed, dispatch } = useStoreContext();

  const [error, setError] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const aiButtonEnabled = computed.aiReady && !isLoading;

  useEffect(() => {
    const downloadFolders = async () => {
      try {
        const folders = await bookmarkService.getAllFolders();

        dispatch({ type: ActionType.SetFolders, payload: folders });
      } catch (error) {
        console.error(error);
      }
    };

    downloadFolders();
  }, []);

  const handlePrompt = async (promptPayload: PromptPayload) => {
    if (!state.aiCapabilities || state.aiCapabilities === 'unsupported') {
      throw new Error('AI capabilities are not supported.');
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await aiService.runPrompt(promptPayload);

      dispatch({ type: ActionType.SetAiSuggestion, payload: result });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagDelete = (folderId: Folder['id']) => {
    dispatch({
      type: ActionType.SelectFolders,
      payload: state.selectedFolderIds.filter((id) => id !== folderId),
    });
  };

  const getTagIcon = (folderId: Folder['id']) =>
    state.suggestedFolderIds.includes(folderId) ? (
      <AutoAwesomeIcon color="primary" />
    ) : undefined;

  return (
    <div>
      <Autocomplete
        multiple
        disabled={isLoading}
        sx={{ mt: 2 }}
        options={state.allFolderIds}
        getOptionLabel={(folderId) => state.foldersById[folderId].title}
        getOptionKey={(folderId) => folderId}
        value={state.selectedFolderIds}
        onChange={(_, folderIds) =>
          dispatch({ type: ActionType.SelectFolders, payload: folderIds })
        }
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((id: string, index: number) => {
            // eslint-disable-next-line
            const { key, onDelete, ...tagProps } = getTagProps({ index });

            return (
              <Chip
                icon={getTagIcon(id)}
                variant="outlined"
                label={state.foldersById[id].title}
                key={id}
                onDelete={() => handleTagDelete(id)}
                {...tagProps}
              />
            );
          })
        }
        renderInput={(params) => (
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                {...params}
                error={!!error}
                helperText={error}
                label="Bookmark Folders"
                placeholder="Bookmark Folders"
              />

              {isLoading && <LinearProgress />}
            </Box>

            <Fab
              color="primary"
              aria-label="suggest folders"
              size="small"
              disabled={!aiButtonEnabled}
              sx={{ flexShrink: 0, ml: '12px', mt: '9px' }}
              onClick={() => handlePrompt(computed.promptPayload)}
            >
              <AutoAwesomeIcon />
            </Fab>
          </Paper>
        )}
      />
    </div>
  );
};
