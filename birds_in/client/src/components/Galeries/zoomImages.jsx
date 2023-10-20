import * as React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

export const zoomImages = ({ image, open, onClose }) => {
    const [zoomed, setZoomed] = React.useState(false);
    const handleZoomToggle = () => {
        setZoomed(!zoomed);
    };
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogContent>
                <img src={image} alt="Imagen en diálogo" style={{ maxWidth: '100%' }} />
                <IconButton
                    edge="end"
                    color="primary"
                    onClick={onClose}
                    aria-label="close"
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                >
                    Cerrar
                </IconButton>
                <Button onClick={handleZoomToggle}>
                    {zoomed ? 'Desactivar Zoom' : 'Activar Zoom'}
                </Button>
            </DialogContent>
        </Dialog>
    );
};