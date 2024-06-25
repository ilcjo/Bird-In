
const mapFieldValues = (dataArray, fieldName, idFieldName) => {
    const uniqueValues = [...new Set(dataArray.map(item => item[fieldName]))];
    uniqueValues.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    return uniqueValues.map(value => {
        const item = dataArray.find(item => item[fieldName] === value);
        return {
            id: item[idFieldName], // Usamos el valor de idFieldName como ID único
            nombre: value
        }
    });
};

module.exports = mapFieldValues;

