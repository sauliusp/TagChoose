import React, { useEffect } from 'react';
import { tabPreviewService } from '../services/TabPreviewService';
import { bookmarkService } from '../services/bookmarkService';
import { useStoreContext } from '../store/StoreContext';

import {
  TextField,
  Button,
  Container,
  Typography,
  InputAdornment,
} from '@mui/material';
import { TagSelect } from './TagSelect';
import { ActionType } from '../store/Store';
import { SavedTab } from '../types/SavedTab';
import { TabPreview } from '../types/TabPreview';
import { aiService } from '../services/AiService';
import { AlertsContainer } from './AlertsContainer';

export const UploadForm: React.FC = () => {
  const { state, computed, dispatch } = useStoreContext();

  const { currentTab } = state;

  const getCurrentTab = async () => {
    try {
      const tabPreview: TabPreview =
        await tabPreviewService.getCurrentTabPreview();

      const savedTab: SavedTab | null = await bookmarkService.getSavedTabByUrl(
        tabPreview.url,
      );

      dispatch({
        type: ActionType.SetCurrentTab,
        payload: { tabPreview, savedTab },
      });

      if (savedTab) {
        dispatch({
          type: ActionType.SelectFolders,
          payload: savedTab.folders.map((folder) => folder.id),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAiCapabilities = async () => {
    const capabilities = await aiService.getAiCapabilities();

    if (
      capabilities !== 'unsupported' &&
      capabilities.available === 'after-download'
    ) {
      aiService.initSession();
    }

    dispatch({ type: ActionType.SetAiCapabilities, payload: capabilities });
  };

  useEffect(() => {
    getCurrentTab();

    getAiCapabilities();
  }, []);

  const handleSubmit = async () => {
    try {
      await bookmarkService.upsertBookmarkInMultipleFolders(
        state.selectedFolderIds,
        currentTab.title,
        currentTab.preview.url,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const isTabSaved = computed.savedTab !== null;

  const actionText = `${isTabSaved ? 'Update' : 'Save'} Bookmark`;

  return (
    <Container sx={{ py: 3 }} role="form">
      <AlertsContainer />

      <Typography variant="subtitle1" gutterBottom>
        {actionText}
      </Typography>

      {currentTab && (
        <TextField
          label="Bookmark Title"
          value={currentTab.title}
          onChange={(e) =>
            dispatch({
              type: ActionType.UpdateTabTitle,
              payload: e.target.value,
            })
          }
          fullWidth
          margin="normal"
          aria-label="Bookmark Title"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img
                  src={currentTab.preview.faviconUrl}
                  alt={`${currentTab.title} favicon`}
                  style={{ width: 24, height: 24 }}
                />
              </InputAdornment>
            ),
          }}
        />
      )}
      <TagSelect aria-label="Tag Selection" />

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleSubmit}
        fullWidth
        sx={{ mt: 3 }}
        role="submit"
        aria-label={actionText}
      >
        {actionText}
      </Button>
    </Container>
  );
};
