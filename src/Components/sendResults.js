import emailjs from '@emailjs/browser';

/**
 * Sends test results via email using EmailJS.
 * @param {Object} results - Object containing test results and user information.
 * @returns {Promise} A promise that resolves when the email is sent successfully, or rejects on error.
 */
export const sendEmailResults = (results) => {
  return new Promise((resolve, reject) => {
    const templateParams = {
      testName2: 'Inventario de Depresión de Beck II',
      testScore2: typeof results['2'] === 'object' ? JSON.stringify(results['2']) : results['2'],
      testName3: 'Inventario de Ansiedad de Beck',
      testScore3: results['3'],
      testName4: 'Tamizaje de probióticos',
      testScore4: results['4'],
      testName5: 'Cuestionario de adherencia a la dieta mediterránea',
      testScore5: results['5'],
      testName6: 'Tamizaje vitamina D',
      testScore6: results['6'],
      testName8: 'Inventario de desesperanza de BECK',
      testScore8: JSON.stringify(results['8']),
      testName9: 'Cuestionario Salamanca de Trastornos de la Personalidad',
      testScore9: JSON.stringify(results['9']),
      testName10: 'Cuestionario de Trastornos del humor',
      testScore10: JSON.stringify(results['10']),
      testName11: 'Cuestionario Internacional de Actividad Física IPAQ',
      testScore11: JSON.stringify(results['11']),
      userName: results.formulario.nombre,
      userLastName: results.formulario.Apellido,
      userBirthdate: results.formulario.fechaNacimiento,
      userEmail: results.formulario.email,
      userReferrer: results.formulario.referente,
      userReferrerEmail: results.formulario.referenteEmail,
      userAge: results.formulario.edadActual,
      userChronologicalAge: results.formulario.edadCronologica,
    };

    emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      templateParams,
      process.env.REACT_APP_EMAILJS_USER_ID
    )
      .then((response) => {
        console.log('Resultados enviados correctamente:', response);
        resolve();
      })
      .catch((error) => {
        console.error('Error al enviar los resultados:', error);
        reject(error);
      });
  });
};

/**
 * Sends a notification email to the referrer using EmailJS.
 * @param {Object} patientInfo - Object containing patient information.
 * @returns {Promise} A promise that resolves when the email is sent successfully, or rejects on error.
 */
export const sendNotificationEmail = (patientInfo) => {
  return new Promise((resolve, reject) => {
    const templateParams = {
      to_email: patientInfo.formulario.referenteEmail,
      to_name: patientInfo.formulario.referente,
      patient_name: `${patientInfo.formulario.nombre} ${patientInfo.formulario.Apellido}`,
      patient_email: patientInfo.formulario.email,
      patient_age: patientInfo.formulario.edadCronologica,
      userAge: patientInfo.formulario.edadActual,
      userBirthdate: patientInfo.formulario.fechaNacimiento,
    };

    emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_NOTIFICATION_TEMPLATE_ID,
      templateParams,
      process.env.REACT_APP_EMAILJS_USER_ID
    )
      .then((response) => {
        console.log('Notificación enviada correctamente:', response);
        resolve();
      })
      .catch((error) => {
        console.error('Error al enviar la notificación:', error);
        reject(error);
      });
  });
};