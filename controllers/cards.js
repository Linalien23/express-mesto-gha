const Card = require('../models/card');
const NotFound = require('../error/NotFound');
const {
  BAD_REQUEST,
  NOT_FOUND_CODE,
  INTERNAL_SERVER_ERROR,
} = require('../errors/statusCode');

module.exports.getCards = (req, res) => {
  Card.find({}) // находим все карточки
    .then((card) => res.send({ data: card })) // вернём записанные в базу данные
    .catch(() => { // данные не записались, вернём ошибку
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере.' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки. ',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере.' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные удаления.',
        });
      } else if (err.name === 'NotFound') {
        res.status(NOT_FOUND_CODE).send({
          message: 'Карточка с указанным _id не найдена.',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере.' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(NOT_FOUND_CODE).send({
          message: 'Передан несуществующий _id карточки',
        });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере.' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные для снятия лайка.',
        });
      } else if (err.name === 'NotFound') {
        res.status(NOT_FOUND_CODE).send({
          message: 'Передан несуществующий _id карточки.',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере.' });
      }
    });
};