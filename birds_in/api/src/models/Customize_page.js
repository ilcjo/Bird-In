const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('customize_page', {
        id_customize: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        cover_birds: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        cover_animals: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        cover_fish: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        cover_land: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        cover_about: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        cover_reptile: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        cover_insect: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        text_about: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        first_about: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        text_login: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        logo: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        colaboradores: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        background_aves: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        background_paisaje: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        background_login: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        background_reptile: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        background_insect: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        background_fish: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        background_mamiferos: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        background_update_ave: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        background_update_mamifero: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        background_update_reptil: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        background_update_insect: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        background_update_land: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        background_update_fish: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        background_mantenimiento: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        background_sobremi: {
            type: DataTypes.TEXT,
            allowNull: true
        },

    }, { timestamps: false, }
    )
};