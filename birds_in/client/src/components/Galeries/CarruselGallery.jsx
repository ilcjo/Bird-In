import * as React from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Viewer from 'react-viewer';

export const CarruselGallery = ({ isOpen, images, onClose,  selectedIndex  }) => {
  const [viewerIsOpen, setViewerIsOpen] = React.useState(false);
  const [viewerImages, setViewerImages] = React.useState([]);
  const [viewerIndex, setViewerIndex] = React.useState(0);

  // Actualizar las imágenes cuando cambie la prop 'images'
  React.useEffect(() => {
    setViewerImages(images.map((image) => ({ src: image.url, alt: extractNameAfterUnderscore(image.url) })));
  }, [images]);

  const closeViewer = () => {
    setViewerIndex(0);
    setViewerIsOpen(false);
    // closeGallery(false);
    onClose()
  };
  React.useEffect(() => {
    // Busca el índice de la imagen en base a la URL seleccionada
    const foundIndex = images.findIndex((image) => image.url === selectedIndex);
    // Establece el índice en el estado
    
      setViewerIndex(foundIndex);
    
  }, [selectedIndex]);

  // Abre el visor cuando 'isOpen' cambia a 'true'
  React.useEffect(() => {
    if (isOpen) {
      setViewerIsOpen(true);
    }
  }, [isOpen]);
  React.useEffect(() => {
    return () => {
      // Limpiar y restablecer estados cuando el componente se desmonta
      closeViewer();
    };
  }, []);

 const extractNameAfterUnderscore = (url) => {
    const firstUnderscoreIndex = url.indexOf('_');
    if (firstUnderscoreIndex !== -1 && firstUnderscoreIndex !== url.length - 1) {
      return url.substring(firstUnderscoreIndex + 1);
    } else {
      return url;
    }
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
        customToolbar={(toolbars) => {
          return toolbars.concat([
            {
              key: 'image-name',
              render: () => (
                <div style={{ position: 'absolute', bottom: 10, left: 10, color: 'white', zIndex: 1 }}>
                  {viewerImages[viewerIndex] && viewerImages[viewerIndex].alt}
                </div>
              ),
            },
          ]);
        }}
      />
    </div>
  );
};