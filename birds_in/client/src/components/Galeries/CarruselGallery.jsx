import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Typography, imageListClasses } from '@mui/material';
import { Carousel } from 'react-responsive-carousel'
import CloseIcon from '@mui/icons-material/Close';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import * as React from 'react'

export const CarruselGallery = ({ isOpen, images, onClose }) => {
  console.log('soy images',images)
  const [selectedImage, setSelectedImage] = React.useState(null);

  const openDialog = (images) => {
    setSelectedImage(images);
  };

  const closeDialog = () => {
    setSelectedImage(null);
    onClose(); // Cierra el diálogo cuando se hace clic en "Cerrar"
  };

  return (
  
  <div>
      <Dialog open={isOpen} onClose={closeDialog} maxWidth="ml" fullWidth>
        <DialogActions>
          <Button onClick={closeDialog} startIcon={<CloseIcon />}>Cerrar</Button>
        </DialogActions>
        <DialogContent>
          {isOpen && images && images.length > 0 ? (
            <Carousel showArrows={true}>
              {images.map((image, index) => (
                <div key={index}>
                  <img src={image.url} alt={`Image ${index}`} style={{
                    maxWidth: '100vh',
                    maxHeight: '90vh',
                    height: '100%',
                    width: '100%',
                    overflow: 'hidden'
                  }} />
                  {/* <Paper
                    square
                    elevation={0}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      height: 50,
                      pl: 2,
                      background: 'linear-gradient(rgba(137, 138, 108, 0), rgba(0, 61, 21, 0.5))',
                    }}
                  >
                    <Typography>ubicacion</Typography>
                  </Paper> */}
                </div>
              ))}
            </Carousel>
          ) : (
            <Typography variant="body2">No hay imágenes disponibles.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};