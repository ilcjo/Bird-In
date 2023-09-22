import * as React from 'react'
import { SearchBird } from '../SearchBird';


export const Search = ({ changeTab }) => {

    const handleCardClick = () => {
      // Llama a la función para cambiar la pestaña activa (por ejemplo, cambia a la pestaña de actualización)
      changeTab(2); // Cambia a la pestaña de actualización (el número depende de la pestaña que desees)
    };
    return (
        <div>
            <SearchBird toggleForm={handleCardClick} />
        </div>
    );
};




