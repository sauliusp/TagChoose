import React from 'react';
import { useStoreContext } from '../store/StoreContext';
import { Alert, Link } from '@mui/material';

export const AlertsContainer: React.FC = () => {
  const { computed, state } = useStoreContext();

  const aiCapabilitiesReady =
    state.aiCapabilities !== null && state.aiCapabilities !== 'unsupported';

  const showSavedTabAlert = computed.savedTab !== null;
  const showAiWarning =
    aiCapabilitiesReady && state.aiCapabilities.available === 'no';
  const showAiError = state.aiCapabilities === 'unsupported';
  const showDownloadWarning =
    aiCapabilitiesReady && state.aiCapabilities.available === 'after-download';

  return (
    <>
      {showSavedTabAlert && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          role="alert"
          aria-live="polite"
        >
          This page is already bookmarked, but you can update its title or
          modify the associated folders.
        </Alert>
      )}

      {showAiWarning && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          role="alert"
          aria-live="assertive"
        >
          AI features are supported in your browser but are currently
          unavailable. You can still tag this bookmark using autocomplete. Visit
          the product&apos;s{' '}
          <Link
            href="https://github.com/sauliusp/TagChoose/blob/main/README.md#installation"
            target="_blank"
            underline="none"
            aria-label="Technical Details"
          >
            Technical Details
          </Link>{' '}
          page for more information and troubleshooting steps.
        </Alert>
      )}

      {showDownloadWarning && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          role="alert"
          aria-live="assertive"
        >
          The AI model is being downloaded... This may take some time, but you
          can still tag this bookmark manually using autocomplete in the
          meantime.
        </Alert>
      )}

      {showAiError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          role="alert"
          aria-live="assertive"
        >
          AI features are not supported in your browser. However, you can still
          tag this bookmark manually using autocomplete.
        </Alert>
      )}
    </>
  );
};
