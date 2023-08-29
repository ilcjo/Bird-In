export const createIdString = (array) => {
    const idArray = array.map(item => item.id);
    console.log('soy la funcion helper id string', idArray)
    return idArray.join(',');
};
