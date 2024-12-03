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
  ButtonOwnProps,
} from '@mui/material';
import { TagSelect } from './TagSelect';
import { ActionType } from '../store/Store';
import { SavedTab } from '../types/SavedTab';
import { TabPreview } from '../types/TabPreview';
import { aiService } from '../services/AiService';
import { AlertsContainer } from './AlertsContainer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const POPUP_CLOSE_DELAY = 350;

export const UploadForm: React.FC = () => {
  const {
    state: { currentTab, selectedFolderIds },
    computed,
    dispatch,
  } = useStoreContext();

  const [submitComplete, setSubmitComplete] = React.useState(false);

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
    if (submitComplete) {
      return;
    }

    try {
      await bookmarkService.upsertBookmarkInMultipleFolders(
        selectedFolderIds,
        currentTab.title,
        currentTab.preview.url,
      );

      setSubmitComplete(true);

      closePopup();
    } catch (error) {
      console.error(error);
    }
  };

  const closePopup = () => {
    setTimeout(() => {
      window.close();
    }, POPUP_CLOSE_DELAY);
  };

  const isTabSaved = computed.savedTab !== null;

  const ctaText = `${isTabSaved ? 'Update' : 'Save'} Bookmark`;

  const ctaButtonConfig: {
    color: ButtonOwnProps['color'];
    content: React.ReactNode;
  } = submitComplete
    ? {
        color: 'success',
        content: (
          <>
            <CheckCircleIcon sx={{ mr: 1 }} /> {ctaText}
          </>
        ),
      }
    : {
        color: 'primary',
        content: ctaText,
      };

  return (
    <Container sx={{ py: 3 }} role="form">
      <AlertsContainer />

      <Typography variant="subtitle1" gutterBottom>
        {ctaText}
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
        color={ctaButtonConfig.color}
        size="large"
        onClick={handleSubmit}
        fullWidth
        sx={{ mt: 3 }}
        role="submit"
        aria-label="Submit"
      >
        {ctaButtonConfig.content}
      </Button>
    </Container>
  );
};
