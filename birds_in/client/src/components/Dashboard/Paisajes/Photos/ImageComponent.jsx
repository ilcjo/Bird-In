import * as React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Grid, Typography, Divider, Button, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ImageDragContainer from './ImageDragContainer';
import Loading from './Loading';

const ImageComponent = ({ images, loadingMessage, showBackdrop, handleReturnSearch, handleDeleteButtonClick, handleImageClick, handleSetAsCover, handleDeleteCheckBox, snackbarOpen, setSnackbarOpen, snackbarMessage, errorSnackbarOpen, setErrorSnackbarOpen, errorMessage, nombre, isCreate }) => {

  return (
    <React.Fragment>
      <Loading message={loadingMessage} open={showBackdrop} />
      <Grid container spacing={5} sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'rgba(0, 56, 28, 0.1)',
        backdropFilter: 'blur(2px)',
        padding: '0px 40px 30px 0px',
        borderRadius: '0px 0px 20px 20px',
        mb: 10,
      }}>
        <Grid item xs={12} md={12}>
          <Grid container alignItems="center">
            <Grid item xs={12} sm={9}>
              <Typography variant='h2' color='primary'>
                Imágenes {nombre ? ` ${nombre}` : 'del Registro '}
              </Typography>
            </Grid>
            {!isCreate && (
              <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} >
                <Button
                  sx={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(0, 56, 28, 0.1)',
                    backdropFilter: 'blur(2px)',
                  }}
                  variant="outlined"
                  onClick={handleReturnSearch}
                  startIcon={<SearchIcon />}
                >
                  Buscar Otro Registro
                </Button>
              </Grid>
            )}
          </Grid>
          <Typography variant='h5' color='primary.light' sx={{ mt: 2 }}>
            Elegir Portada o Eliminar Imágenes
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'primary.main' }} />
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteButtonClick}
            endIcon={<DeleteIcon />}
            sx={{ mt: 0, mb: 2, color: 'primary.light' }}
          >
            Eliminar selección
          </Button>

          <DndProvider backend={HTML5Backend}>
            <ImageDragContainer
              images={images}
              handleImageClick={handleImageClick}
              handleSetAsCover={handleSetAsCover}
              handleDeleteCheckBox={handleDeleteCheckBox}
            />
          </DndProvider>

          {images.length === 0 && (
            <Typography variant='body1' color='primary.light' sx={{ marginTop: '10px' }}>
              No hay imágenes subidas.
            </Typography>
          )}
        </Grid>
      </Grid>
      <Snackbar open={snackbarOpen} autoHideDuration={9000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} />
      <Snackbar open={errorSnackbarOpen} autoHideDuration={9000} onClose={() => setErrorSnackbarOpen(false)}>
        <Alert elevation={6} variant="filled" severity="error" onClose={() => setErrorSnackbarOpen(false)}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}

export default ImageComponent;
