import * as React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
  imageListClasses
} from '@mui/material';
import { Carousel } from 'react-responsive-carousel'
import CloseIcon from '@mui/icons-material/Close';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Viewer from 'react-viewer';


export const CarruselGallery = ({ isOpen, images, onClose }) => {
  const [viewerIsOpen, setViewerIsOpen] = React.useState(false);
  const [viewerImages, setViewerImages] = React.useState([]);
  const [viewerIndex, setViewerIndex] = React.useState(0);

  // Actualizar las imágenes cuando cambie la prop 'images'
  React.useEffect(() => {
    setViewerImages(images.map((image) => ({ src: image.url })));
  }, [images]);

  const openViewer = (index) => {
    setViewerIndex(index);
    setViewerIsOpen(true);
  };

  const closeViewer = () => {
    setViewerIndex(0);
    setViewerIsOpen(false);
    onClose();
  };

  // Abre el visor cuando 'isOpen' cambia a 'true'
  React.useEffect(() => {
    if (isOpen) {
      setViewerIsOpen(true);
    }
  }, [isOpen]);

  const customToolbar = {
    rotateLeft: false, // Desactivar rotación a la izquierda
    rotateRight: false, // Desactivar rotación a la derecha
  };


  return (
    <div>
    <Viewer
      visible={viewerIsOpen}
        onClose={closeViewer}
        images={viewerImages}
        activeIndex={viewerIndex}
        rotatable={false}  // Desactivar rotación
        rotatableKeyModifiers={[]}  // Desactivar rotación
      />
    </div>
  );
};