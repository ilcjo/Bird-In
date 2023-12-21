// emailService.js

const nodemailer = require('nodemailer');
require('dotenv').config();
const {EMAIL_PASS, EMAIL_USER} = process.env

// Configurar Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Usa SSL
  auth: {
    user: 'ileanacanofotografia@gmail.com',
    pass: 'xtitgtakwxgiqavl',
  },
});

// Función para enviar el correo a usuarios de aprobacion
const sendWelcomeEmail = async (email, userName) => {
  try {
    const emailBodyWelcome = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bienvenido a la aplicación</title>
            <style>
              /* Establecer el ancho del contenedor principal */
              .email-container {
                max-width: 500px; 
                margin: 0 auto;
                text-align: left;
                font-size: 18px;
              }
            </style>
          </head>
          <body style="font-family: Arial, sans-serif;">
        
            <!-- Contenedor principal -->
            <div class="email-container">
        
              <!-- Encabezado del Correo con el Logo -->
              <div style="text-align: center; padding: 20px;">
                <img src="https://lasavesquepasaronpormisojos.com/imagenes/customize/1697576310392-Logo.png" alt="Logo de la aplicación" width="150">
              </div>
        
              <!-- Contenido del Correo -->
              <div style="text-align: center; padding: 20px;">
                <h1>¡Gracias por unirte a nuestra comunidad, ${userName}!</h1>
                <p style="text-align: left" >"Tu cuenta está en proceso de aprobación. El proceso de aprobación puede tardar de 24 a 72 horas. 
                Te notificaremos a través de correo electrónico tan pronto tu solicitud sea aprobada.</p>
              </div>
        
              <!-- Pie de Página -->
              <div style="background-color: #f1f1f1; padding: 10px; text-align: center;">
                <p style="font-size: 12px;">© 2023 LaSavesQuePasaronPorMisOjos.com. Todos los derechos reservados.</p>
              </div>
        
            </div>
        
          </body>
          </html>
        `;
    const emailAdminNewUser = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nuevo Usuario registrado</title>
            <style>
              /* Establecer el ancho del contenedor principal */
              .email-container {
                max-width: 500px; 
                margin: 0 auto;
                text-align: left;
                font-size: 18px;
              }
            </style>
          </head>
          <body style="font-family: Arial, sans-serif;">
        
            <!-- Contenedor principal -->
            <div class="email-container">
        
              <!-- Encabezado del Correo con el Logo -->
              <div style="text-align: center; padding: 20px;">
                <img src="https://lasavesquepasaronpormisojos.com/imagenes/customize/1697576310392-Logo.png" alt="Logo de la aplicación" width="150">
              </div>
        
              <!-- Contenido del Correo -->
              <div style="text-align: center; padding: 20px;">
                <h1>¡El usuario: ${email} esta esperando tu aprobación!</h1>
          
              </div>
        
              <!-- Pie de Página -->
              <div style="background-color: #f1f1f1; padding: 10px; text-align: center;">
                <p style="font-size: 12px;">© 2023 LaSavesQuePasaronPorMisOjos.com. Todos los derechos reservados.</p>
              </div>
        
            </div>
        
          </body>
          </html>
        `;

    const userMailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Bienvenido a la aplicación',
      html: emailBodyWelcome,
    };

    const adminMailOptions = {
      from: EMAIL_USER,
      to: EMAIL_USER, // Reemplaza con la dirección de correo del administrador
      subject: 'Nueva solicitud por aprobar',
      html: emailAdminNewUser,
    };
    // Enviar correo de bienvenida al usuario
    const userMailInfo = await transporter.sendMail(userMailOptions);

    // Enviar notificación al administrador
    const adminMailInfo = await transporter.sendMail(adminMailOptions);

    // Registro del correo enviado
    console.log(`Correo de bienvenida enviado a ${email}: ${userMailInfo.response}`);
    console.log(`Notificación de nueva solicitud enviada al administrador: ${adminMailInfo.response}`);
  } catch (error) {
    // Manejo de errores
    console.error('Error al enviar el correo:', error.message);
    throw new Error('Error al enviar el correo electrónico de bienvenida');
  }
};

// Función para enviar el correo de aprobación
const sendApprovalEmail = async (email, userName) => {
  try {
    const emailBodyApproval = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Aprobación de cuenta</title>
            <style>
              /* Establecer el ancho del contenedor principal */
              .email-container {
                max-width: 500px; 
                margin: 0 auto;
                text-align: left;
                font-size: 18px;
              }
            </style>
          </head>
          <body style="font-family: Arial, sans-serif;">
        
            <!-- Contenedor principal -->
            <div class="email-container">
        
              <!-- Encabezado del Correo con el Logo -->
              <div style="text-align: center; padding: 20px;">
                <img src="https://lasavesquepasaronpormisojos.com/imagenes/customize/1697576310392-Logo.png" alt="Logo de la aplicación" width="150">
              </div>
        
              <!-- Contenido del Correo -->
              <div style="text-align: center; padding: 20px;">
                <h1>¡Hola ${userName}!</h1>
                <p style="text-align: left;">¡Felicidades! Tu cuenta ha sido aprobada y ahora puedes acceder a nuestra plataforma. 
                Inicia sesión para comenzar a explorar todas las aves que pasaron por mis ojos.</p>
              </div>
        
              <!-- Pie de Página -->
              <div style="background-color: #f1f1f1; padding: 10px; text-align: center;">
                <p style="font-size: 12px;">© 2023 LaSavesQuePasaronPorMisOjos.com. Todos los derechos reservados.</p>
              </div>
        
            </div>
        
          </body>
          </html>
        `;

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: '¡Tu cuenta ha sido aprobada!',
      html: emailBodyApproval,
    };

    // Usar async/await para manejar la promesa devuelta por sendMail
    const info = await transporter.sendMail(mailOptions);

    // Registro del correo enviado
    console.log(`Correo de aprobación enviado a ${email}: ${info.response}`);
  } catch (error) {
    // Manejo de errores
    console.error('Error al enviar el correo de aprobación:', error.message);
    throw new Error('Error al enviar el correo de aprobación de cuenta');
  }
};
// Función para enviar el correo de aprobación
const sendEmailRecoverPass = async (email, token) => {
  try {
    const emailBodyApproval = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Aprobación de cuenta</title>
            <style>
              /* Establecer el ancho del contenedor principal */
              .email-container {
                max-width: 500px; 
                margin: 0 auto;
                text-align: left;
                font-size: 18px;
              }
            </style>
          </head>
          <body style="font-family: Arial, sans-serif;">
        
            <!-- Contenedor principal -->
            <div class="email-container">
        
              <!-- Encabezado del Correo con el Logo -->
              <div style="text-align: center; padding: 20px;">
                <img src="https://lasavesquepasaronpormisojos.com/imagenes/customize/1697576310392-Logo.png" alt="Logo de la aplicación" width="150">
              </div>
        
              <!-- Contenido del Correo -->
              <div style="text-align: center; padding: 20px;">
                <p style="text-align: left;"> Número de verificación: </p>
              </div>
        
              <!-- Pie de Página -->
              <div style="background-color: #f1f1f1; padding: 10px; text-align: center;">
                <p style="font-size: 12px;">© 2023 LaSavesQuePasaronPorMisOjos.com. Todos los derechos reservados.</p>
              </div>
        
            </div>
        
          </body>
          </html>
        `;

    const mailOptions = {
      from:  'ileanacanofotografia@gmail.com',
      to: email,
      subject: 'Recuperación de contraseña las Aves',
      html: emailBodyApproval,
    };

    // Usar async/await para manejar la promesa devuelta por sendMail
    const info = await transporter.sendMail(mailOptions);

    // Registro del correo enviado
    console.log(`Correo de aprobación enviado a ${email}: ${info.response}`);
  } catch (error) {
    // Manejo de errores
    console.error('Error al enviar el correo de aprobación:', error.message);
    throw new Error('Error al enviar el correo de aprobación de cuenta');
  }
};

module.exports = { sendWelcomeEmail, sendApprovalEmail };
