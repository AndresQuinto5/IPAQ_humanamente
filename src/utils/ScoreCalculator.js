/**
 * @file ScoreCalculator.js
 * @description This file contains functions for calculating scores of various psychometric tests.
 */

/**
 * Calculates the sum of scores for tests that use simple addition.
 * @param {number[]} scores - An array of numeric scores.
 * @returns {number} The sum of all scores.
 */
const calculateSumOfScores = (scores) => {
  return scores.reduce((a, b) => a + b, 0);
};

/**
 * Calculates the sum of scores and provides a description for item 9 (Beck Depression Inventory II).
 * @param {number[]} scores - An array of numeric scores.
 * @returns {Object} An object containing the total score and description for item 9.
 */
const calculateSumOfScoresWithItem9Description = (scores) => {
  const totalScore = scores.reduce((a, b) => a + b, 0);
  const item9Score = scores[8];
  let item9Description;

  switch(item9Score) {
    case 0:
      item9Description = "No tengo ningún pensamiento de matarme";
      break;
    case 1:
      item9Description = "He tenido pensamientos de matarme, pero no lo haría";
      break;
    case 2:
      item9Description = "Querría matarme";
      break;
    case 3:
      item9Description = "Me mataría si tuviera la oportunidad de hacerlo";
      break;
    default:
      item9Description = "Respuesta no válida para el ítem 9";
  }

  return { totalScore, item9Description };
};

/**
 * Calculates scores for the Beck Hopelessness Scale.
 * @param {number[]} scores - An array of numeric scores.
 * @returns {Object} An object containing total score and factor scores.
 */ 
const calculateBeckDesesperanza = (scores) => {
  const scoreIndexes = {
    afectivo: [0, 5, 12, 14, 18],
    motivacional: [1, 2, 8, 10, 11, 15, 16, 19],
    cognitivo: [3, 6, 7, 13, 17],
  };

  const factorScores = Object.entries(scoreIndexes).reduce((acc, [factor, indexes]) => {
    acc[factor] = indexes.reduce((sum, index) => sum + scores[index], 0);
    return acc;
  }, {});

  const totalScore = scores.reduce((a, b) => a + b, 0);

  return { totalScore, ...factorScores };
};

/**
 * Calculates scores for the Salamanca Questionnaire for Personality Disorders.
 * @param {number[]} scores - An array of numeric scores.
 * @returns {Object} An object containing scores for each subscale.
 */
const calculateSalamanca = (scores) => {
  const groupIndexes = {
    A: [0, 1, 2, 3, 4, 5],
    B: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    C: [16, 17, 18, 19, 20, 21]
  };

  const groupScores = Object.entries(groupIndexes).reduce((acc, [group, indexes]) => {
    acc[group] = indexes.map(index => scores[index] || 0);
    return acc;
  }, {});

  return {
    PAR: groupScores.A[0] + groupScores.A[1],
    ESQ: groupScores.A[2] + groupScores.A[3],
    EQT: groupScores.A[4] + groupScores.A[5],
    HIST: groupScores.B[0] + groupScores.B[1],
    ANT: groupScores.B[2] + groupScores.B[3],
    NAR: groupScores.B[4] + groupScores.B[5],
    IE_IMP: groupScores.B[6] + groupScores.B[7],
    IE_LIM: groupScores.B[8] + groupScores.B[9],
    ANAN: groupScores.C[0] + groupScores.C[1],
    DEP: groupScores.C[2] + groupScores.C[3],
    ANS: groupScores.C[4] + groupScores.C[5],
  };
};

/**
 * Calculates scores for the MDQ (Mood Disorder Questionnaire).
 * @param {number[]} scores - An array of numeric scores.
 * @returns {Object} An object containing the sum of first 13 items and additional responses.
 */
const calculateMDQScore = (scores) => {
  const sumFirst13 = scores.slice(0, 13).reduce((sum, score) => sum + score, 0);
  const additionalResponses = {
    Item2: scores[13],
    Item3: scores[14],
    Item4: scores[15],
    Item5: scores[16],
  };
  return { sumFirst13, ...additionalResponses };
};

/**
 * Calculates scores for the IPAQ (International Physical Activity Questionnaire).
 * @param {number[]} scores - An array of numeric scores.
 * @returns {Object} An object containing responses for each question.
 */
const calculateIPAQScore = (scores) => {
  return scores.reduce((acc, score, index) => {
    acc[`Pregunta${index + 1}`] = score;
    return acc;
  }, {});
};

/**
 * Main function to calculate total score based on test ID.
 * @param {string} testId - The ID of the test.
 * @param {number[]} scores - An array of numeric scores.
 * @param {Object[]} questions - An array of question objects (unused in current implementation).
 * @returns {*} The calculated score(s) for the specified test.
 * @throws {Error} If the test ID is not recognized.
 */
const calculateTotalScore = (testId, scores, questions) => {
  switch (testId) {
    case "2":
      return calculateSumOfScoresWithItem9Description(scores);
    case "3":
    case "4":
    case "5":
    case "6":
      return calculateSumOfScores(scores);
    case "8":
      return calculateBeckDesesperanza(scores);
    case "9":
      return calculateSalamanca(scores);
    case "10":
      return calculateMDQScore(scores);
    case "11":
      return calculateIPAQScore(scores);
    default:
      throw new Error(`Test ID ${testId} no reconocido`);
  }
};

export default calculateTotalScore;