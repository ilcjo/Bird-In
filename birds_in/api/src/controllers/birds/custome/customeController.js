const { Customize_page } = require('../../../db/db');

const fetchCustome = async () => {
    try {
        const getAllCutomizes = await Customize_page.findOne({
            attributes: [
                'id_customize',
                'cover_login',
                'cover_birds',
                'cover_animals',
                'cover_fish',
                'cover_land',
                'cover_about',
                'covert_admin',
                'header',
                'cover_flowers',
                'first_about',
                'logo',
                'text_about',
                'text_login',
                'colaboradores',
                'background_aves',
                'background_paisaje',
                'filter_back_land',
            ],
        });
        return getAllCutomizes

    } catch (error) {
        console.error('Error al buscar info:', error);
        throw error;
    }
};

const sendParametersForUpdate = async (customizationParams) => {
    console.log(customizationParams);
    try {
        // Obtener la primera fila, asumiendo que solo hay una fila en Customize_page
        let customizeInfo = await Customize_page.findOne();

        const updated = {};  // Crear la constante para almacenar el resultado final

        Object.keys(customizationParams).forEach((param) => {
            customizeInfo[param] = customizationParams[param];
            updated[param] = customizeInfo[param]
        }
        );
        console.log('updated', updated)
        // await Customize_page.update(updateFields, { where: { id_customize: customizeInfo.id_customize } });
        // // Guardar los cambios
        if (Object.keys(updated).length > 0) {
            // Construir y ejecutar una instrucción SQL UPDATE para actualizar los campos en la base de datos
            await Customize_page.update(updated, { where: { id_customize: customizeInfo.id_customize } });
        }

        // Devolver el objeto customizeInfo actualizado
        return " La portada se ha actualizado correctamente."
    } catch (error) {
        console.error('Error al buscar info:', error);
        throw error;
    }

};

const sendParametersForUpdateText = async (customizationParams) => {
    console.log(customizationParams);
    try {
        // Obtener la primera fila, asumiendo que solo hay una fila en Customize_page
        let customizeInfo = await Customize_page.findOne();

        const updated = {};  // Crear la constante para almacenar el resultado final

        Object.keys(customizationParams).forEach((param) => {
            customizeInfo[param] = customizationParams[param];
            updated[param] = customizeInfo[param]
        }
        );
        console.log('updated', updated)
        // await Customize_page.update(updateFields, { where: { id_customize: customizeInfo.id_customize } });
        // // Guardar los cambios
        if (Object.keys(updated).length > 0) {
            // Construir y ejecutar una instrucción SQL UPDATE para actualizar los campos en la base de datos
            await Customize_page.update(updated, { where: { id_customize: customizeInfo.id_customize } });
        }

        // Devolver el objeto customizeInfo actualizado
        return " El texto se ha actualizado correctamente."
    } catch (error) {
        console.error('Error al buscar info:', error);
        throw error;
    }

};

module.exports = {
    fetchCustome,
    sendParametersForUpdate,
    sendParametersForUpdateText
}

//     try {login, birds, animals, fish, land, about, admin, header, tabout, descrip, flower, tlogin, colab
//         // Obtener la primera fila, asumiendo que solo hay una fila en Customize_page
//         let customizeInfo = await Customize_page.findOne();

//         if (!customizeInfo) {
//             // Si no se encuentra ninguna configuración personalizada, crea una nueva fila
//             customizeInfo = await Customize_page.create({});
//         }

//         // Actualizar solo los campos que tengan valores no nulos
//         customizeInfo.cover_login = login || customizeInfo.cover_login;
//         customizeInfo.cover_birds = birds || customizeInfo.cover_birds;
//         customizeInfo.cover_animals = animals || customizeInfo.cover_animals;
//         customizeInfo.cover_fish = fish || customizeInfo.cover_fish;
//         customizeInfo.cover_land = land || customizeInfo.cover_land;
//         customizeInfo.cover_about = about || customizeInfo.cover_about;
//         customizeInfo.covert_admin = admin || customizeInfo.covert_admin;
//         customizeInfo.header = header || customizeInfo.header;
//         customizeInfo.text_about = tabout || customizeInfo.text_about;
//         customizeInfo.first_about = descrip || customizeInfo.first_about;
//         customizeInfo.cover_flowers = flower || customizeInfo.cover_flowers;
//         customizeInfo.text_login = tlogin || customizeInfo.text_login;
//         customizeInfo.colaboradores = colab || customizeInfo.colaboradores;

//         // Guardar los cambios
//         await customizeInfo.save();

//         return "La configuración se ha actualizado correctamente.";
//     } catch (error) {
//         console.error('Error al buscar info:', error);
//         throw error;
//     }
// };