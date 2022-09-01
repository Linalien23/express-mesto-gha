const cardRouter = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards'); // данные нужны для роутинга, поэтому импортируем их

const cardIdValidate = Joi.string().hex().length(24);

cardRouter.get('', getCards);

cardRouter.post('', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30), // обязательная строка от 2 до 30 символов
    link: Joi.string().required().regex(/https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i),
  }),
}), createCard);

cardRouter.delete('/:cardId', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: cardIdValidate,
  }),
}), deleteCard);

cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: cardIdValidate,
  }),
}), likeCard);

cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: cardIdValidate,
  }),
}), dislikeCard);

module.exports = cardRouter;