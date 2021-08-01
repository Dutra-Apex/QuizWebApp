/**
 * This is where you will create routes for our
 * questions API
 * Base url: /api/questions
 * We have imported express and router and
 * exported the router.
 *
 * Your task is to fill in the router with appropriate
 * routes and implement the functionality of getting
 * data from mongodb and return appropriate results
 */

const express = require("express");
const router = express.Router();
const uuid = require("uuid");

// Question Data
const Questions = require("../../models/questions-data.json");
// Hint: get a bonus task here
const shuffleArray = require("../../utils/shuffle");

/**
 * Route details
 * api GET /api/questions
 * Description: Get all questions in the database
 * IMPORTANT: remove the answers from it's data
 * we don't want the client to know the answer.
 *
 * Structure of the return JSON:
 * [
 *    {
 *      question: 'sample question',
 *      options: [
 *        'option1',
 *        'option2'
 *      ],
 *      id: '1234'
 *    }
 * ]
 *
 */

// copying the questions array and adding the right properties in
let QCopy = [];
let num = 1;
QCopy = Questions.map((q) => ({
  question: q.question,
  options: q.options,
  id: (num++).toString(),
}));

router.get("/", (req, res) => {
  res.send(shuffleArray(QCopy));
});

/**
 * Route details
 * api GET /api/questions/count
 * Description: This will get the count of the questions
 * from the database and return it
 * Structure of the return JSON:
 * {
 *  count: 4
 * }
 */
router.get("/count", (req, res) => {
  res.json({ count: Questions.length });
});

/**
 * Route details
 * api GET /api/questions/:qId
 * Description: This will get one question given the question ID
 * Structure of the return JSON:
 * {
 *    question: 'sample question',
 *    options: [
 *      'option1',
 *      'option2'
 *    ],
 *    id: '1234'
 * }
 */
router.get("/:qId", (req, res) => {
  let qwid = {};
  for (let q of QCopy) {
    if (q.id == req.params.qId) {
      qwid = {
        question: q.question,
        options: q.options,
        id: req.params.qId,
      };
    }
    /* console.log(q.id, req.params.qId, q.id == req.params.qId); */
  }
  res.json(qwid);
});

/**
 * Route details
 * api POST /api/questions/result
 * Description: This will receive a body with user
 * entered answers and will return the results.
 * Calculation of the result will happen here and you
 * would only send the results.
 *
 * Structure of body JSON:
 * {
 *    'questionID': 'user-answer',
 *    'questionID': 'user-answer'
 * }
 *
 * Structure of the return JSON:
 * {
 *    summary: 'passed OR failed',
 *    score: (how many answers were correct),
 *    total: (how many questions were there)
 * }
 */
router.post("/result", (req, res) => {
  // checking if the player answered correctly and
  // incrementing their score if they did
  let playerScore = 0;
  let values = Object.values(req.body);
  /* console.log(values); */
  Questions.map((q) => {
    if (values.includes(q.answer)) {
      playerScore++;
    }
  });

  // determinging if the player passed or failed
  let result = "";
  if (playerScore < 3) {
    result = "failed";
  } else {
    result = "passed";
  }

  // sending back the json
  res.send({
    summary: result,
    score: playerScore,
    total: 4,
  });
});

module.exports = router;
