import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import * as React from 'react'
import { useSelector } from 'react-redux';


export const SectionCovers = ({ title, coverKey }) => {

    const [selectedImageUrl, setSelectedImageUrl] = React.useState(null);
    const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const { allCustom } = useSelector((state) => state.customizesSlice);
  const handleImageClick = (imageSrc) => {
        setSelectedImageUrl(imageSrc);
        setUploadModalOpen(true);
    };

    const handleCloseUploadModal = () => {
        setUploadModalOpen(false);
        setSelectedImageUrl(selectedImageUrl || allCustom[coverKey]);
        setSelectedFile(null);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setSelectedFile(file.name);
            const imageUrl = URL.createObjectURL(file);
            setSelectedImageUrl(imageUrl);
        }

        setUploadModalOpen(false);
    };


    return (
        <Grid item xs={6} sm={12}>
            <Typography variant='body2' color='primary.main' sx={{ mt: 1 }}>
                {title}
            </Typography>
            <Button onClick={() => handleImageClick(allCustom[coverKey])}>
                <img
                    src={selectedImageUrl || allCustom[coverKey]}
                    alt={`Imagen ${title}`}
                    style={{ maxWidth: '200px', maxHeight: '100px', marginTop: '10px', cursor: 'pointer' }}
                />
            </Button>
            {/* Modal para subir archivos */}
            <Dialog open={uploadModalOpen} onClose={handleCloseUploadModal}>
                <DialogTitle>Subir Archivo</DialogTitle>
                <DialogContent>
                    {selectedImageUrl && (
                        <img
                            src={selectedImageUrl}
                            alt="Imagen seleccionada"
                            style={{ maxWidth: '100%', maxHeight: '400px', marginBottom: '10px' }}
                        />
                    )}
                    <input type="file" onChange={handleFileChange} style={{ marginTop: '10px' }} />
                    {selectedFile && (
                        <Typography variant="body1" color="textSecondary" sx={{ marginTop: '10px' }}>
                            Archivo seleccionado: {selectedFile}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUploadModal} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleFileChange} color="primary">
                        Subir
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}
