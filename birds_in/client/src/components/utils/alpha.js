export const sortAlphabetically = (data) => {
    if (Array.isArray(data)) {
        // Si es un array, ordena alfabéticamente
        return data.slice().sort((a, b) => {
            if (a && a.nombre && b && b.nombre) {
                const nameA = a.nombre.charAt(0).toUpperCase() + a.nombre.slice(1);
                const nameB = b.nombre.charAt(0).toUpperCase() + b.nombre.slice(1);
                return nameA.localeCompare(nameB);
            }
            return 0;
        });
    } else if (typeof data === 'object' || data.length === 0) {
        // Si es un objeto, maneja el objeto según tus necesidades
        // Puedes convertirlo en un array antes de ordenarlo o tratarlo de otra manera
        const dataArray = Object.values(data);
        return dataArray; // Ordena según tus necesidades
    } else {
        // Maneja otros tipos de datos según sea necesario
        return [];
    }
};
