const organizeAlphabetically = (records) => {
    return records.sort((a, b) => {
        const countryA = a.paise?.dataValues?.nombre || ''; // Nombre del país o cadena vacía si no existe
        const countryB = b.paise?.dataValues?.nombre || '';
        const zoneA = a.zona?.dataValues?.nombre || ''; // Nombre de la zona o cadena vacía si no existe
        const zoneB = b.zona?.dataValues?.nombre || '';

        // Ordenar primero por país
        if (countryA < countryB) return -1;
        if (countryA > countryB) return 1;

        // Si los países son iguales, ordenar por zona
        if (zoneA < zoneB) return -1;
        if (zoneA > zoneB) return 1;

        return 0; // Son iguales
    });
};

module.exports = {
    organizeAlphabetically
}