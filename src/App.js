import React, { useState, useEffect, useRef } from 'react';
import Question from './Components/Question';
import { questionsData } from './Components/questions.js';
import { useResults } from './Components/ResultsContext';
import calculateTotalScore from './utils/ScoreCalculator';
import FormInput from './Components/FormInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { sendEmailResults } from './Components/sendResults'; // Asegúrate de que la ruta sea correcta
import IPAQForm from './Components/IPAQForm.jsx';
import "./App.css"
const initialFormValues = {
  nombre: "",
  Apellido: "",
  fechaNacimiento: "",
  email: "",
  referente: "",
};

function App() {
  const { results, addResult, setResults } = useResults();
  const [currentTestId, setCurrentTestId] = useState("2");  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [showTransition, setShowTransition] = useState(false); // Nuevo estado para la transición
  const isTestCompleted = (testId) => {
    return results.hasOwnProperty(testId);
  };
  const [alertShown, setAlertShown] = useState(false);
  const confirmationMessageRef = useRef(null);
  const countdownMessageRef = useRef(null);
  const [resultsSent, setResultsSent] = useState(false);

  //Aqui comienzan las declaraciones para el formulario
  const [formCompleted, setFormCompleted] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  
  // Nuevo estado para controlar la versión de la aplicación
  const [withoutSalamanca, setWithoutSalamanca] = useState(false);

  // Definición de los inputs del formulario
  const inputs = [
    {
      id: 1,
      name: "nombre",
      type: "text",
      placeholder: "Nombre",
      errorMessage: "El nombre es requerido",
      label: "Nombre",
      required: true,
    },
    {
      id: 2,
      name: "Apellido",
      type: "text",
      placeholder: "Apellido",
      errorMessage: "El apellido es requerido",
      label: "Apellido",
      required: true,
    },
    {
      id: 3,
      name: "email",
      type: "email",
      placeholder: "Correo electrónico",
      errorMessage: "Debe ser una dirección de correo electrónico válida",
      label: "Correo Electrónico",
      required: true,
    },    
    {
      id: 4,
      name: "fechaNacimiento",
      type: "date",
      placeholder: "Fecha de nacimiento",
      label: "Fecha de Nacimiento",
      required: true,
    },
    // {
    //   id: 4,
    //   name: "genero",
    //   type: "select",
    //   label: "Género",
    //   options: ["Masculino", "Femenino", "Otro"],
    //   required: true,
    // },
    {
      id: 5,
      name: "referente",
      type: "text",
      placeholder: "Médico o psicólogo tratante",
      errorMessage: "Este campo es requerido",
      label: "Referente",
      required: true,
    },
    
  ];
  //IPAQ
  const [showIPAQForm, setShowIPAQForm] = useState(false);

  const handleIPAQFormSubmit = (ipaQResponses) => {
    // console.log(ipaQResponses); // Manejo de las respuestas del formulario IPAQ
    addResult('11', ipaQResponses); // Asumiendo que '11' es el ID del test IPAQ
    setShowIPAQForm(false); // Ocultar el formulario IPAQ
  
    // Añadir la lógica de transición aquí
    setShowTransition(true); // Iniciar la animación de carga
    setTimeout(() => {
      const nextTest = questionsData.find(test => !isTestCompleted(test.testId) && test.testId !== '11'); // Asumiendo que '11' es el ID del formulario IPAQ
      if (nextTest) {
        setCurrentTestId(nextTest.testId);
      } else {
        setCurrentTestId(null); // Si no hay más pruebas, se establece a null
      }
      setShowTransition(false); // Terminar la animación de carga
    }, 1000); // Duración de la animación de carga (ajusta según sea necesario)
  };
  

  // y se asegurará de que las preguntas y las puntuaciones se actualicen
  useEffect(() => {
    if (currentTestId) {
      setLoading(true);
      let filteredQuestionsData = questionsData;
      
      // Filtrar la prueba de Salamanca si es necesario
      if (withoutSalamanca) {
        filteredQuestionsData = questionsData.filter(test => test.testId !== '9');
      }
  
      const test = filteredQuestionsData.find(test => test.testId === currentTestId);
      if (test) {
        setQuestions(test.questions);
        setScores(Array(test.questions.length).fill(null));
      } else {
        setCurrentTestId(null);
      }
      setLoading(false);
    }
  }, [currentTestId, withoutSalamanca]);

  // Efecto para comprobar el parámetro de URL al cargar la aplicación
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const version = params.get('version');
    setWithoutSalamanca(version === 'withoutSalamanca');
  }, []);
  
  // // Este efecto se ejecutará cada vez que finished cambie y se asegurará de que se muestre el mensaje de alerta solo una vez por prueba el cual indica que la prueba se ha completado
  // useEffect(() => {
  //   if (finished && !alertShown) {
  //     const totalScore = calculateTotalScore(currentTestId, scores, questions);
  //     addResult(currentTestId, totalScore); 
  //     // alert(`Prueba completada. Tu puntuación total es ${JSON.stringify(totalScore)}`);
  //     setAlertShown(true); // Asegúrate de que el alert se muestra solo una vez
  //   }
  // }, [finished, currentTestId, scores, questions, addResult, alertShown]);

  // Este useEffect se asegurará de que cada vez que results se actualice, se imprima el estado actualizado
  // useEffect(() => {
  //   // console.log('Todos los resultados hasta ahora:', results);
  // }, [results]);

  // Manejador de clic en respuesta actualizado para manejar el fin de las preguntas correctamente
  const handleAnswerClick = (score) => {
    const updatedScores = [...scores];
    updatedScores[currentQuestion] = score;

    const isLastQuestion = currentQuestion === questions.length - 1;
    setScores(updatedScores);

    if (isLastQuestion) {
      setFinished(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const renderTestButtons = () => (
    <div className="test-buttons-container">
      {questionsData
        .filter(test => !withoutSalamanca || test.testId !== '9')
        .map((test) => (
          <button
            key={test.testId}
            className={`test-button ${currentTestId === test.testId ? 'active-test' : ''}`}
            disabled={isTestCompleted(test.testId)}
            onClick={() => setCurrentTestId(test.testId)}
          >
            {test.testName || 'Nombre no definido'} {isTestCompleted(test.testId) ? '✓' : ''}
          </button>
        ))}
    </div>
  );

  // Mover la lógica de goToNextTest dentro de handleFinishTest
  const handleFinishTest = () => {
    const totalScore = calculateTotalScore(currentTestId, scores, questions);
    addResult(currentTestId, totalScore);
    setShowTransition(true);
    setTimeout(() => {
      let nextTest;
      if (withoutSalamanca) {
        nextTest = questionsData.find(
          (test) => !isTestCompleted(test.testId) && test.testId !== currentTestId && test.testId !== '9'
        );
      } else {
        nextTest = questionsData.find(
          (test) => !isTestCompleted(test.testId) && test.testId !== currentTestId
        );
      }
      
      if (nextTest) {
        setCurrentTestId(nextTest.testId);
        setCurrentQuestion(0);
        setScores(Array(nextTest.questions.length).fill(null));
      } else {
        setCurrentTestId(null);
      }
      setShowTransition(false);
      setFinished(false);
    }, 1000);
  };

  // Este efecto maneja la finalización de una prueba y pasa a la siguiente
  useEffect(() => {
    if (finished) {
      handleFinishTest();
    }
  }, [finished, currentTestId, scores, questions]); // Asegúrate de incluir todas las dependencias necesarias
  
  useEffect(() => {
    if (scores.some(score => score !== null)) { // Verificar si hay al menos una respuesta
      // console.log(`Respuestas para la prueba ${currentTestId}:`);
      questions.forEach((question, index) => {
        // console.log(`Pregunta ${index + 1}: ${question.statement}, Respuesta: ${scores[index]}`);
      });
    }
  }, [scores, questions, currentTestId]); // Dependencias del efecto secundario

// Funciones para manejar el formulario
const handleSubmit = (e) => {
  e.preventDefault();
  if (e.target.checkValidity()) {
      // Calcula la edad y la edad cronológica
      const age = calculateAge(formValues.fechaNacimiento);
      const ageString = `${age.years} años, ${age.months} meses, ${age.days} días`;

      // Actualiza formValues con la edad y la edad cronológica
      const updatedFormValues = {
          ...formValues,
          edadActual: age.years,
          edadCronologica: ageString,
      };
      
      setFormValues(updatedFormValues);
      addResult("formulario", updatedFormValues);
      setFormCompleted(true);
      console.log("Formulario completado", updatedFormValues);
  } else {
      console.error("El formulario tiene errores");
  }
};

const onChange = (e) => {
  setFormValues({ ...formValues, [e.target.name]: e.target.value });
};
//handle para respuesta anterior:
const handlePreviousClick = () => {
  if (currentQuestion > 0) {
    setCurrentQuestion(currentQuestion - 1);
  }
};

// SE UTILIZA AHORA UN ESE EFFECT
// function handleSendResults() {
//   if (!resultsSent) {
//     setResultsSent(true);

//     // Llamar a la función para enviar los resultados por email
//     sendEmailResults(results)
//       .then(() => {
//         if (confirmationMessageRef.current) {
//           confirmationMessageRef.current.textContent = 'Resultados enviados correctamente.';
//         }
        
//         // Iniciar cuenta regresiva antes de reiniciar la aplicación
//         let countdown = 5;
//         const countdownInterval = setInterval(() => {
//           if (countdownMessageRef.current) {
//             countdownMessageRef.current.textContent = `La aplicación se reiniciará en ${countdown} segundos...`;
//           }
//           countdown--;
//           if (countdown < 0) {
//             clearInterval(countdownInterval);
//             resetApp();
//           }
//         }, 1000);
//       })
//       .catch((error) => {
//         console.error('Error al enviar los resultados:', error);
//         if (confirmationMessageRef.current) {
//           confirmationMessageRef.current.textContent = 'Error al enviar los resultados. Por favor, inténtalo nuevamente.';
//         }
//       });
//   }
// }
useEffect(() => {
  if (currentTestId === null && !resultsSent) {
    setResultsSent(true);

    // Llamar a la función para enviar los resultados por email
    sendEmailResults(results)
      .then(() => {
        if (confirmationMessageRef.current) {
          confirmationMessageRef.current.textContent = 'Resultados enviados correctamente.';
        }
        
        // Iniciar cuenta regresiva antes de reiniciar la aplicación
        let countdown = 5;
        const countdownInterval = setInterval(() => {
          if (countdownMessageRef.current) {
            countdownMessageRef.current.textContent = `La aplicación se reiniciará en ${countdown} segundos...`;
          }
          countdown--;
          if (countdown < 0) {
            clearInterval(countdownInterval);
            resetApp();
          }
        }, 1000);
      })
      .catch((error) => {
        console.error('Error al enviar los resultados:', error);
        if (confirmationMessageRef.current) {
          confirmationMessageRef.current.textContent = 'Error al enviar los resultados. Por favor, inténtalo nuevamente.';
        }
      });
  }
}, [currentTestId, resultsSent, results]);

const resetApp = () => {
  // Limpia los resultados y restablece los estados iniciales
  setResults({});
  setCurrentTestId("2");  // Asumiendo que "2" es el ID de la primera prueba
  setCurrentQuestion(0);
  setScores([]);
  setFinished(false);
  setShowTransition(false);
  setFormCompleted(false);
  setFormValues(initialFormValues); 
};

function calculateAge(birthDate) {
  const birth = new Date(birthDate);
  const today = new Date();

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  // Ajuste si el día actual es menor que el día de nacimiento
  if (days < 0) {
      months -= 1;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }

  // Ajuste si el mes actual es menor que el mes de nacimiento
  if (months < 0) {
      years -= 1;
      months += 12;
  }

  return { years, months, days };
}


// Lógica para renderizar el formulario o las pruebas
if (!formCompleted) {
  return (
    <div className="App">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1>Tu información</h1>
          {inputs.map((input) => (
            <FormInput
              key={input.id}
              {...input}
              value={formValues[input.name]}
              onChange={onChange}
            />
          ))}
          <button type="submit" className="ComenzarP">Comenzar Pruebas</button>
        </form>
      </div>
    </div>
  );
}

if (showTransition) {
 // Pantalla de transición con spinner
    return (
      <div className="App transition-screen">
        <div className="spinner"></div>
      </div>
    );
}
// Renderizado condicional basado en si se completaron todas las pruebas o no
else if (currentTestId === null) {
return (
  <div className="App">
    <div className="card send-results-container">
      <h2 className="send-results-title">¡Felicidades!</h2>
      <p className="send-results-message">Has completado todas las pruebas.</p>
      <div className="send-results-loading">
        <div className="loading-spinner"></div>
        <p className="loading-message">Los resultados se están enviando...</p>
      </div>
      <p className="send-results-countdown" ref={countdownMessageRef}></p>
      <p className="send-results-confirmation" ref={confirmationMessageRef}></p>
    </div>
  </div>
);
} else {
  // Renderizado normal de las pruebas
  return (
    <div className="App">
      {/* <h1>Prueba Psicométrica</h1> */}
      {renderTestButtons()}
      <div className="question-card-wrapper"> 
        {loading ? (
          <p>Cargando...</p>
        ) :  currentTestId === '11' ? (
          <IPAQForm onSubmit={handleIPAQFormSubmit} />
          ) : (
          currentTestId && questions && questions.length > 0 && currentQuestion < questions.length && (
            <Question
              question={questions[currentQuestion]}
              handleAnswerClick={handleAnswerClick}
              handlePreviousClick={handlePreviousClick}
              instructions={questionsData.find(test => test.testId === currentTestId)?.instructions}
              testName={questionsData.find(test => test.testId === currentTestId)?.testName}
              currentQuestion={currentQuestion}
                        />
          )
        )}
      </div>
    </div>
  );
}
}

export default App;
