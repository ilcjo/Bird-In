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
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(10, minmax(120px, 1fr))',
                    gap: '10px',
                    marginTop: '25px'
                }}
            >
                {allImageURLs.map((imageUrl, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                        <img
                            src={imageUrl}
                            alt={`Imagen seleccionada ${index + 1}`}
                            style={{ width: '100%', height: 'auto', maxHeight: '120px' }}
                        />
                        <IconButton
                            color="error"
                            onClick={() => handleRemoveImage(index)}
                            style={{ position: 'absolute', top: '8px', right: '0px' }}
                        >
                            <DisabledByDefaultIcon />
                        </IconButton>
                    </div>
                ))}
            </div>
        )}
    </div>
);
};