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
        cover_login: {
            type: DataTypes.TEXT,
            allowNull: false
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
        covert_admin: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        header: {
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
        cover_flowers: {
            type: DataTypes.TEXT,
            allowNull: false
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
        }
    }, { timestamps: false, }
    )
}