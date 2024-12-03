import React from 'react';
import { Box, Toolbar, AppBar, Typography } from '@mui/material';

export const Footer: React.FC = () => {
  return (
    <AppBar color="transparent" position="static" role="footer">
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            justifyContent: 'center',
            flexGrow: 1,
          }}
        >
          <Typography variant="subtitle2" aria-label="date">
            © {new Date().getFullYear()}
          </Typography>

          <Typography variant="subtitle2" color="primary" role="logo">
            #TagChoose
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
