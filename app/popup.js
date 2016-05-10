const db = require('level')('../cinema.db')
const seats = require('./seats')

module.exports = function popup({params: {film, date, time}}, res) {
    db.get(film, {encoding:'json'}, function(err, film) {
        res.render('popup', {
            film: data,
            screening: {
                title: data.title,
                date: req.params.date,
                time: req.params.time,
                price: data.price
            },
            rows: seats(film, date, time)
        })
    })
}
