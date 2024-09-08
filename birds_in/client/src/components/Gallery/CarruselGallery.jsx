import * as React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Viewer from 'react-viewer';

export const CarruselGallery = ({ isOpen, images, onClose, selectedIndex }) => {
  const [viewerIsOpen, setViewerIsOpen] = React.useState(false);
  const [viewerImages, setViewerImages] = React.useState([]);
  const [viewerIndex, setViewerIndex] = React.useState(null);

  // Actualizar las imágenes cuando cambie la prop 'images'
  React.useEffect(() => {
    setViewerImages(images.map((image) => ({ src: image.url, alt: extractNameAfterUnderscore(image.url) })));
  }, [images]);

  // Abre el visor cuando 'isOpen' cambia a 'true'
  React.useEffect(() => {
    if (isOpen) {
      setViewerIsOpen(true);
    }
  }, [isOpen]);

  const closeViewer = () => {
    setViewerIndex(0);
    setViewerIsOpen(false);
    onClose();
  };

  const extractNameAfterUnderscore = (url) => {
    const firstUnderscoreIndex = url.indexOf('_');
    if (firstUnderscoreIndex !== -1 && firstUnderscoreIndex !== url.length - 1) {
      return url.substring(firstUnderscoreIndex + 1);
    } else {
      return url;
    }
  };

  return (
    <div onContextMenu={(e) => e.preventDefault()}>
      <Viewer
        visible={viewerIsOpen}
        onClose={closeViewer}
        images={viewerImages}
        activeIndex={viewerImages.findIndex((image) => image.src === selectedIndex)}
        rotatable={false}
        rotatableKeyModifiers={[]}
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

