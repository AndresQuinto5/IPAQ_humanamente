import React, { useState } from 'react';
import './IPAQForm.css';

const IPAQForm = ({ onSubmit }) => {
  const initialState = {
    question1: '0',
    question2: { type: 'hours', hours: '1', minutes: '0' },
    question3: '0',
    question4: { type: 'hours', hours: '1', minutes: '0' },
    question5: '0',
    question6: { type: 'hours', hours: '0', minutes: '0', notSure: false },
    question7: { type: 'hours', hours: '0', minutes: '0', notSure: false },
  };

  const [ipaQResponses, setIpaQResponses] = useState(initialState);
  const [currentQuestion, setCurrentQuestion] = useState(1);

  const handleInputChange = (e, questionNumber) => {
    const { name, value, type, checked } = e.target;

    if (type === 'radio') {
      setIpaQResponses(prev => ({
        ...prev,
        [`question${questionNumber}`]: { ...prev[`question${questionNumber}`], type: value, hours: '1', minutes: '0' },
      }));
    } else if (type === 'checkbox' && questionNumber !== 2 && questionNumber !== 4) {
      setIpaQResponses(prev => ({
        ...prev,
        [`question${questionNumber}`]: { ...prev[`question${questionNumber}`], notSure: checked, hours: checked ? '1' : prev[`question${questionNumber}`].hours, minutes: checked ? '0' : prev[`question${questionNumber}`].minutes },
      }));
    } else if (['question1', 'question3', 'question5'].includes(name)) {
      setIpaQResponses(prev => ({ 
        ...prev, 
        [name]: value,
        [`question${parseInt(name.slice(-1)) + 1}`]: value === '0' ? initialState[`question${parseInt(name.slice(-1)) + 1}`] : prev[`question${parseInt(name.slice(-1)) + 1}`]
      }));
    } else {
      // Lógica para horas y minutos
      let newValue = value;
      if (name.endsWith('Hours')) {
        newValue = value === '0' ? '1' : value;
      }
      if (name.endsWith('Minutes') && (parseInt(value) < 0 || parseInt(value) > 59)) {
        newValue = '0';
      }
      const fieldToUpdate = name.endsWith('Hours') ? 'hours' : 'minutes';
      setIpaQResponses(prev => ({
        ...prev,
        [`question${questionNumber}`]: { ...prev[`question${questionNumber}`], [fieldToUpdate]: newValue },
      }));
    }
  };

  const nextQuestion = () => {
    if (currentQuestion === 1 && ipaQResponses.question1 === '0') {
      setCurrentQuestion(3);
    } else if (currentQuestion === 3 && ipaQResponses.question3 === '0') {
      setCurrentQuestion(5);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 1) {
      if (currentQuestion === 3 && ipaQResponses.question1 === '0') {
        setCurrentQuestion(1);
      } else if (currentQuestion === 5 && ipaQResponses.question3 === '0') {
        setCurrentQuestion(3);
      } else {
        setCurrentQuestion(currentQuestion - 1);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(ipaQResponses); // Esta función ahora debería manejar la transición y carga
  };

  return (
    <div className="IPAQForm-container">
      <div className="card">
        <h2 className="card-header">Cuestionario Internacional de Actividad Física (IPAQ)</h2>
        <form onSubmit={handleSubmit} className="IPAQForm-container">
          {currentQuestion === 1 && (
            <div className="formInput">
              <label htmlFor="question1">Durante los últimos siete días, ¿cuantos días realizó usted actividades físicas vigorosas?</label>
              <select
                id="question1"
                name="question1"
                value={ipaQResponses.question1}
                onChange={(e) => handleInputChange(e, 1)}
                className="form-control"
              >
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i} value={i.toString()}>{i === 0 ? 'Ninguna' : `${i} día(s)`}</option>
                ))}
              </select>
              <button type="button" onClick={nextQuestion}>Siguiente</button>
            </div>
          )}

          {currentQuestion === 2 && ipaQResponses.question1 !== '0' && (
            <div className="formInput">
              <label htmlFor="question2">¿Cuánto tiempo en total le tomó realizar actividades físicas vigorosas en uno de esos días?</label>
              <div className="timeInput">
                <input
                  type="radio"
                  id="question2TypeHours"
                  name="question2Type"
                  value="hours"
                  checked={ipaQResponses.question2.type === 'hours'}
                  onChange={(e) => handleInputChange(e, 2)}
                />
                <label htmlFor="question2TypeHours">Horas por día</label>
                <select
                  id="question2Hours"
                  name="question2Hours"
                  value={ipaQResponses.question2.hours}
                  onChange={(e) => handleInputChange(e, 2)}
                  disabled={ipaQResponses.question2.type !== 'hours'}
                >
                  {Array.from({ length: 16 }, (_, i) => (
                    <option key={i} value={(i + 1).toString()}>{i + 1}</option>
                  ))}
                </select>
              </div>
              <div className="timeInput">
                <input
                  type="radio"
                  id="question2TypeMinutes"
                  name="question2Type"
                  value="minutes"
                  checked={ipaQResponses.question2.type === 'minutes'}
                  onChange={(e) => handleInputChange(e, 2)}
                />
                <label htmlFor="question2TypeMinutes">Minutos por día</label>
                <select
                  id="question2Minutes"
                  name="question2Minutes"
                  value={ipaQResponses.question2.minutes}
                  onChange={(e) => handleInputChange(e, 2)}
                  disabled={ipaQResponses.question2.type !== 'minutes'}
                >
                  {Array.from({ length: 41 }, (_, i) => (
                    <option key={i} value={i + 10}>{i + 10}</option>
                  ))}
                </select>
              </div>
              <button type="button" onClick={previousQuestion}>Regresar</button>
              <button type="button" onClick={nextQuestion}>Siguiente</button>
            </div>
          )}

          {currentQuestion === 3 && (
            <div className="formInput">
              <label htmlFor="question3">Durante los últimos siete días, ¿cuántos días usted hizo actividades físicas moderadas tal como cargar objetos ligeros, pedalear en bicicleta a paso regular, o jugar dobles de tenis?</label>
              <select
                id="question3"
                name="question3"
                value={ipaQResponses.question3}
                onChange={(e) => handleInputChange(e, 3)}
                className="form-control"
              >
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i} value={i.toString()}>{i === 0 ? 'Ninguna' : `${i} día(s)`}</option>
                ))}
              </select>
              <button type="button" onClick={previousQuestion}>Regresar</button>
              <button type="button" onClick={nextQuestion}>Siguiente</button>
            </div>
          )}

          {currentQuestion === 4 && ipaQResponses.question3 !== '0' && (
            <div className="formInput">
              <label htmlFor="question4">Usualmente, ¿cuánto tiempo dedica usted en uno de esos días haciendo actividades físicas moderadas?</label>
              <div className="timeInput">
                <input
                  type="radio"
                  id="question4TypeHours"
                  name="question4Type"
                  value="hours"
                  checked={ipaQResponses.question4.type === 'hours'}
                  onChange={(e) => handleInputChange(e, 4)}
                />
                <label htmlFor="question4TypeHours">Horas por día</label>
                <select
                  id="question4Hours"
                  name="question4Hours"
                  value={ipaQResponses.question4.hours}
                  onChange={(e) => handleInputChange(e, 4)}
                  disabled={ipaQResponses.question4.type !== 'hours'}
                >
                  {Array.from({ length: 16 }, (_, i) => (
                    <option key={i} value={(i + 1).toString()}>{i + 1}</option>
                  ))}
                </select>
              </div>
              <div className="timeInput">
                <input
                  type="radio"
                  id="question4TypeMinutes"
                  name="question4Type"
                  value="minutes"
                  checked={ipaQResponses.question4.type === 'minutes'}
                  onChange={(e) => handleInputChange(e, 4)}
                />
                <label htmlFor="question4TypeMinutes">Minutos por día</label>
                <select
                  id="question4Minutes"
                  name="question4Minutes"
                  value={ipaQResponses.question4.minutes}
                  onChange={(e) => handleInputChange(e, 4)}
                  disabled={ipaQResponses.question4.type !== 'minutes'}
                >
                  {Array.from({ length: 41 }, (_, i) => (
                    <option key={i} value={i + 10}>{i + 10}</option>
                  ))}
                </select>
              </div>
              <button type="button" onClick={previousQuestion}>Regresar</button>
              <button type="button" onClick={nextQuestion}>Siguiente</button>
            </div>
          )}

          {currentQuestion === 5 && (
            <div className="formInput">
              <label htmlFor="question5">Durante los últimos siete días, ¿cuántos días caminó usted por lo menos 10 minutos continuos?</label>
              <select
                id="question5"
                name="question5"
                value={ipaQResponses.question5}
                onChange={(e) => handleInputChange(e, 5)}
                className="form-control"
              >
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i} value={i.toString()}>{i === 0 ? 'Ninguna' : `${i} día(s)`}</option>
                ))}
              </select>
              <button type="button" onClick={previousQuestion}>Regresar</button>
              <button type="button" onClick={nextQuestion}>Siguiente</button>
            </div>
          )}

          {currentQuestion === 6 && (
            <div className="formInput">
              <label htmlFor="question6">Usualmente, ¿cuánto tiempo gastó usted en uno de esos días caminando?</label>
              <div className={`timeInput ${ipaQResponses.question6.notSure ? 'disabled' : ''}`}>
                <input
                  type="radio"
                  id="question6TypeHours"
                  name="question6Type"
                  value="hours"
                  checked={ipaQResponses.question6.type === 'hours'}
                  onChange={(e) => handleInputChange(e, 6)}
                  disabled={ipaQResponses.question6.notSure}
                />
                <label htmlFor="question6TypeHours">Horas por día</label>
                <select
                  id="question6Hours"
                  name="question6Hours"
                  value={ipaQResponses.question6.hours}
                  onChange={(e) => handleInputChange(e, 6)}
                  disabled={ipaQResponses.question6.type !== 'hours' || ipaQResponses.question6.notSure}
                >
                  {Array.from({ length: 16 }, (_, i) => (
                    <option key={i} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              <div className={`timeInput`}>
                <input
                  type="radio"
                  id="question6TypeMinutes"
                  name="question6Type"
                  value="minutes"
                  checked={ipaQResponses.question6.type === 'minutes'}
                  onChange={(e) => handleInputChange(e, 6)}
                  disabled={ipaQResponses.question6.notSure}
                />
                <label htmlFor="question6TypeMinutes">Minutos por día</label>
                <select
                  id="question6Minutes"
                  name="question6Minutes"
                  value={ipaQResponses.question6.minutes}
                  onChange={(e) => handleInputChange(e, 6)}
                  disabled={ipaQResponses.question6.type !== 'minutes' || ipaQResponses.question6.notSure}
                >
                  {Array.from({ length: 41 }, (_, i) => (
                    <option key={i} value={i + 10}>{i + 10}</option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="question6NotSure"
                  name="question6NotSure"
                  checked={ipaQResponses.question6.notSure}
                  onChange={(e) => handleInputChange(e, 6)}
                />
                <label htmlFor="question6NotSure">No estoy seguro</label>
              </div>
              <button type="button" onClick={previousQuestion}>Regresar</button>
              <button type="button" onClick={nextQuestion}>Siguiente</button>
            </div>
          )}

          {currentQuestion === 7 && (
            <div className="formInput">
              <label htmlFor="question7">Durante los últimos siete días, ¿cuánto tiempo permaneció sentado en un día en la semana?</label>
              <div className={`timeInput ${ipaQResponses.question7.notSure ? 'disabled' : ''}`}>
                <input
                  type="radio"
                  id="question7TypeHours"
                  name="question7Type"
                  value="hours"
                  checked={ipaQResponses.question7.type === 'hours'}
                  onChange={(e) => handleInputChange(e, 7)}
                  disabled={ipaQResponses.question7.notSure}
                />
                <label htmlFor="question7TypeHours">Horas por día</label>
                <select
                  id="question7Hours"
                  name="question7Hours"
                  value={ipaQResponses.question7.hours}
                  onChange={(e) => handleInputChange(e, 7)}
                  disabled={ipaQResponses.question7.type !== 'hours' || ipaQResponses.question7.notSure}
                >
                  {Array.from({ length: 16 }, (_, i) => (
                    <option key={i} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              <div className={`timeInput`}>
                <input
                  type="radio"
                  id="question7TypeMinutes"
                  name="question7Type"
                  value="minutes"
                  checked={ipaQResponses.question7.type === 'minutes'}
                  onChange={(e) => handleInputChange(e, 7)}
                  disabled={ipaQResponses.question7.notSure}
                />
                <label htmlFor="question7TypeMinutes">Minutos por día</label>
                <select
                  id="question7Minutes"
                  name="question7Minutes"
                  value={ipaQResponses.question7.minutes}
                  onChange={(e) => handleInputChange(e, 7)}
                  disabled={ipaQResponses.question7.type !== 'minutes' || ipaQResponses.question7.notSure}
                >
                  {Array.from({ length: 41 }, (_, i) => (
                    <option key={i} value={i + 10}>{i + 10}</option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="question7NotSure"
                  name="question7NotSure"
                  checked={ipaQResponses.question7.notSure}
                  onChange={(e) => handleInputChange(e, 7)}
                />
                <label htmlFor="question7NotSure">No estoy seguro</label>
              </div>
              <button type="button" onClick={previousQuestion}>Regresar</button>
              <button type="submit">Enviar Respuestas</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default IPAQForm;
