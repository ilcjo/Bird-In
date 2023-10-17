import * as React from 'react'
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