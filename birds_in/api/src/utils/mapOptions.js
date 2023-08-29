const mapFieldValues = (dataArray, fieldName, idFieldName) => {
    return dataArray.map(item => {
        return {
            id: item[idFieldName],
            nombre: item[fieldName]
        };
    });
};
module.exports = {
    mapFieldValues
};