import React from 'react'
import { Box, Typography } from '@mui/material';

const CopyRight = () => {
    return null; // Este componente no render nada por sí solo
};

CopyRight.Photo = () => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            //   height: '100vh',
        }}
    >
        <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Moisés Sterimberg Photo Collection. All rights reserved.
        </Typography>
    </Box>
);

CopyRight.Website = () => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            //   height: '100vh',
        }}
    >
        <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()}  Website ilcjob.world. All rights reserved.
        </Typography>
    </Box>
);


export { CopyRight };