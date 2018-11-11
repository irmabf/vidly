
const { Genre, validate } = require('../models/Genre');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  //Return genre to the client
  res.send(genre);
});

router.put('/:id', async (req, res) => {

  //Update first approach

  /**
   * db.collection.findOneAndUpdate(filter, update, options)
   *
   * filter: document  the selection criteria for the update. The same query selectors
   * as in the find() method are available
   *
   * update: document the update document
   */
  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  //400 BAD REQUEST
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //If we dont find the genre, 404
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

router.delete('/:id', async (req, res) => {

  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

//Get a single genre

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(genre, schema);
}

module.exports = router;