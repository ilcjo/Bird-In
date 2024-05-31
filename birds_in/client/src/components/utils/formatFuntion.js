export const formatData = (data) => {
    if (!Array.isArray(data)) {
        return ''; // Retorna una cadena vacía si no es un array
    }

    const formattedCountries = data.map((item) => {
        // Verifica si el elemento del array es un objeto con la propiedad "nombre"
        if (typeof data === 'object' && item.nombre) {
            // Capitaliza la primera letra y convierte el resto a minúsculas
            return item.nombre;
        } else {
            // Si no es un objeto o no tiene la propiedad "nombre", retorna un string vacío
            return '';
        }
    });

    // Filtra los elementos no vacíos y une con comas
    const filteredCountries = formattedCountries.filter((data) => data !== '');
    return filteredCountries.join(', ');
}; 