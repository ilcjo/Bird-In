export const createIdString = (array) => {
    const idArray = array.map(item => item.id);
    return idArray.join(',');
};

export const creatParams = (selectedOptions) =>{
let queryParams = '';

if (selectedOptions.grupo && selectedOptions.grupo.length > 0) {
  queryParams += `grupo=${selectedOptions.grupo.map(ave => ave.id).join('&grupo=')}`;
}
if (selectedOptions.familia && selectedOptions.familia.length > 0) {
  queryParams += queryParams ? '&' : '';
  queryParams += `familia=${selectedOptions.familia.map(ave => ave.id).join('&familia=')}`;
}
if (selectedOptions.pais && selectedOptions.pais.length > 0) {
  queryParams += queryParams ? '&' : '';
  queryParams += `pais=${selectedOptions.pais.map(ave => ave.id).join('&pais=')}`;
}
if (selectedOptions.zonas && selectedOptions.zonas.length > 0) {
  queryParams += queryParams ? '&' : '';
  queryParams += selectedOptions.zonas.map(nombre => `zonas=${encodeURIComponent(nombre.nombre)}`).join('&');
}
if (selectedOptions.ingles && selectedOptions.ingles.length > 0) {
  queryParams += queryParams ? '&' : '';
  queryParams += selectedOptions.ingles.map(nombre => `nombreIngles=${encodeURIComponent(nombre.nombre)}`).join('&');
}
if (selectedOptions.cientifico && selectedOptions.cientifico.length > 0) {
  queryParams += queryParams ? '&' : '';
  queryParams += selectedOptions.cientifico.map(nombre => `nombreCientifico=${encodeURIComponent(nombre.nombre)}`).join('&');
}

return queryParams


};