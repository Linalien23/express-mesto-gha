// импортируем нужные модули
const winston = require('winston');
const expressWinston = require('express-winston');

// создадим логгер запросов
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }), //  Опция transports отвечает за то, куда нужно писать лог
  ],
  format: winston.format.json(), // Вторая опция — format отвечает за формат записи логов
});

// логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }), // Ошибки мы пишем в отдельный файл — error.log
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
}; 