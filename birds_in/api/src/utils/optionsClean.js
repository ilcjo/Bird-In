const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const transformAndFilter = (options, fieldName) => {
    const transformed = options.map(option => option[fieldName].trim().toLowerCase());
    const uniqueValues = [...new Set(transformed)]; // Remove duplicates
    return uniqueValues.map(value => capitalizeFirstLetter(value));
};

module.exports = {
    capitalizeFirstLetter,
    transformAndFilter
}