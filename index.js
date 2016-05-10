const express = require('express')
const ecstatic = require('ecstatic') /* для раздачи статики */
const level = require('level') /* удобная маленькая база данных */
const _ = require('lodash/fp')
const db = level('./cinema.db')
const app = express()

/* Настраиваем вьюхи */
const hbs = require('hbs')
hbs.registerPartials('views')
hbs.registerHelper('json', (ctx, opts) => new hbs.SafeString(JSON.stringify(ctx)))
app.set('view engine', 'html')
app.engine('html', hbs.__express)
/* Объявляем роуты */
app.get('/', require('./app/main'))
app.get('/popup/:film/:date/:time', require('./app/popup'))
app.get('/availability/:film/:date/:time', require('./app/availability'))
app.get('/film/:id', require('./app/film'))
/* @TODO: Заменить на что-то поинтересней */
app.post('/order', (req, res) => res.send(JSON.stringify(req.payload)))
app.use(ecstatic('../public'))
/* Запускаем приложение! */
const port = process.env.NODE_PORT || '8080'
app.listen(port, function(err) {
    if (err) {
        console.error('Error while starting up: %s', err)
        process.exit(1)
    }
    console.log('Started listening at http://localhost:' + port)
})
