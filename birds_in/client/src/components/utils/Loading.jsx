import { Backdrop, CircularProgress, Typography } from '@mui/material'
import * as React from 'react'

export const Loading = ({ message, open }) => {
    
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            <>
                <CircularProgress color="inherit" />
                <Typography variant="h5" color="inherit" sx={{ ml: 2 }}>
                    {message}
                </Typography>
            </>
        </Backdrop>
    )
}
