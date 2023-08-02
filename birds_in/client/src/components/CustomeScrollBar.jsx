import React from 'react';
import { Scrollbars } from 'react-scrollbars-custom';

export const CustomeScrollBar = () => {
  return (
    <Scrollbars
      style={{ width: 300, height: 200 }} // Establece el ancho y alto del scrollbar
      thumbMinSize={30} // Tamaño mínimo del thumb (barrón del scrollbar)
      renderThumbVertical={({ style, ...props }) => (
        <div
          {...props}
          style={{
            ...style,
            backgroundColor: '#C1C700', // Color del thumb (barrón del scrollbar)
            borderRadius: 8, // Radio de esquinas del thumb
          }}
        />
      )}
      renderTrackVertical={({ style, ...props }) => (
        <div
          {...props}
          style={{
            ...style,
            backgroundColor: '#ccd6cc', // Color del track (fondo del scrollbar)
            borderRadius: 8, // Radio de esquinas del track
          }}
        />
      )}
    >
      {/* Aquí coloca el contenido que se mostrará con el scrollbar */}
      <div style={{ height: 500 }}>
        <p>Contenido del scrollbar personalizado.</p>
      </div>
    </Scrollbars>
  );
};
