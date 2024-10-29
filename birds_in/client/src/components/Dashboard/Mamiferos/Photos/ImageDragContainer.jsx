import React, { useState, useCallback } from 'react';
import { Grid, Fab, Tooltip, } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { PhotosOrganize } from '../../../Cards/PhotosOrganize';
import { useDispatch } from 'react-redux';
import { saveOrderPhotos } from '../../../../redux/mamiferos/actions/photosAction';
import { getInfoForUpdate } from '../../../../redux/mamiferos/actions/crudAction';

const ImageDragContainer = ({ images, handleImageClick, handleSetAsCover, handleDeleteCheckBox,
    loading, backDrop, snackBar, messageBar, errorMessage, errorBar, idMamifero
}) => {
    const dispatch = useDispatch();
    const [imageList, setImageList] = useState(images);
    const [showFab, setShowFab] = useState(false); // Estado para mostrar el FAB

    React.useEffect(() => {
        setImageList(images);
    }, [images]);

    const moveImage = useCallback((dragIndex, hoverIndex) => {
        const updatedImages = [...imageList];
        const [movedImage] = updatedImages.splice(dragIndex, 1);
        updatedImages.splice(hoverIndex, 0, movedImage);
        setImageList(updatedImages);
        setShowFab(true);  // Mostrar el FAB cuando se reordenen las imágenes
    }, [imageList]);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    // Función para guardar el nuevo orden en la base de datos
    const saveOrderToDB = async () => {
        backDrop(true);
        loading('Guardando orden...');
        setShowFab(false);  // Ocultar FAB al comenzar a guardar

        const orderedImages = imageList.map((image, index) => ({
            id: image.id,
            orden: index + 1  // Asigna el nuevo orden
        }));

        try {
            await dispatch(saveOrderPhotos(orderedImages));
            console.log("Orden guardado en la base de datos.");
            await delay(2000);
            await dispatch(getInfoForUpdate(idMamifero));

            // Mostrar mensaje de éxito
            snackBar(true);
            messageBar('Orden guardado Exitosamente');
        } catch (error) {
            console.error("Error al guardar el orden:", error);
            errorMessage(`Error: ${error.message || "Ocurrió un error inesperado"}`);
            errorBar(true);
        } finally {
            backDrop(false); // Asegurarte de cerrar el backDrop al final
        }
    };

    return (
        <>
            <Grid container spacing={1}>
                {imageList.map((image, index) => (
                    <PhotosOrganize
                        imageUrl={image}
                        index={index}
                        moveImage={moveImage}
                        handleImageClick={handleImageClick}
                        handleSetAsCover={handleSetAsCover}
                        handleDeleteCheckBox={handleDeleteCheckBox}
                        key={image.id}
                    />
                ))}
            </Grid>
            {showFab && (  // Solo muestra el FAB si showFab es true
                <Tooltip title="Guardar orden">
                    <Fab
                        color="primary"
                        aria-label="save"
                        onClick={saveOrderToDB}
                        sx={{
                            position: 'fixed',
                            bottom: 16,
                            right: 16
                        }}
                    >
                        <SaveIcon />
                    </Fab>
                </Tooltip>
            )}
        </>
    );
};

export default ImageDragContainer;
