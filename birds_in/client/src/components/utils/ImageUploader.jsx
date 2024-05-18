import * as  React from 'react'
import { Button, Grid, IconButton } from '@mui/material'
//ICONS
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export const ImageUploader = ({ allImageURLs, handleImageChange, handleRemoveImage }) => {
    return (
        <div>
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="image-upload-input"
            />
            <label htmlFor="image-upload-input">
                <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    endIcon={<UploadFileIcon />}
                >
                    Cargar Imágenes
                </Button>
            </label>
            {allImageURLs.length > 0 && (
                <Grid container spacing={1}>
                    {allImageURLs.map((imageUrl, index) => (
                        <Grid item key={index}>
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={imageUrl}
                                    alt={`Imagen seleccionada ${index + 1}`}
                                    style={{ maxWidth: '200px', maxHeight: '100px', marginTop: '10px' }}
                                />
                                <IconButton
                                    color="primary"
                                    onClick={() => handleRemoveImage(index)}
                                    style={{ position: 'absolute', top: '8px', right: '0px' }}
                                >
                                    <DisabledByDefaultIcon />
                                </IconButton>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    )
}
