const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const Unauthorized = require('../errors/unauthorized');
const BadRequest = require('../errors/badRequest');

const userSchema = new mongoose.Schema({ // схемма пользователя
  name: { // имя пользователя, строка от 2 до 30 символов, обязательное поле
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
    required: false,
  },

  about: { // информация о пользователе, строка от 2 до 30 символов, обязательное поле
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
    required: false,
  },

  avatar: { // ссылка на аватарку, строка, обязательное поле
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    required: false,
    validate: {
      validator(value) {
        return /https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i.test(value);
      },
    },
  },

  email: { // почта
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new BadRequest({ message: 'Некорректный email' });
      }
    },
  },

  password: { // пароль
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findOne(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized('Необходима авторизация'));
      }
      return bcrypt.compare(password, user.password)

        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized('Необходима авторизация'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);