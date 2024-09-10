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
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 5 }}>
            © {new Date().getFullYear()} Moisés Sterimberg Photo Collection.
            <br></br>
            All rights reserved.
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
            mt:2.5
        }}
    >
        <Typography variant="subtitle2i" color="text.secondary">
            © {new Date().getFullYear()}  Website ilcjob.world. 
            All rights reserved.
        </Typography>
    </Box>
);


export { CopyRight };