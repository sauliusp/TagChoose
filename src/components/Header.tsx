import React from 'react';
import { Link, Box, Toolbar, AppBar, Typography } from '@mui/material';

export const Header: React.FC = () => {
  return (
    <AppBar color="transparent" position="static" role="header">
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            justifyContent: 'end',
            flexGrow: 1,
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h6"
            color="primary"
            sx={{ mr: 'auto' }}
            role="logo"
          >
            #TagChoose
          </Typography>

          <Link
            href="https://github.com/sauliusp/TagChoose/blob/main/PRODUCT_SPEC.md"
            target="_blank"
            underline="none"
            aria-label="About the Project"
          >
            About the Project
          </Link>
          <Link
            href="https://github.com/sauliusp/TagChoose/blob/main/README.md"
            target="_blank"
            underline="none"
            aria-label="Technical Details"
          >
            Technical Details
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
