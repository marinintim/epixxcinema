const db = require('level')('../cinema.db')
const seats = require('./seats')
module.exports = function main(req, res) {
    /* Тут нужно тоже заменить */
    db.get('1', {encoding:'json'}, (err, data) => {
        if (err) {
            console.error(err)
            return res.send('error')
        }

        res.render('index', {
            film: data,
            popup: {
                film: data,
                screening: {
                    title: data.title,
                    date: '2015-01-30',
                    time: '19:30',
                    price: data.price,
                },
                /* @TODO: Заменить на разные даты */
                rows: seats(data, '2015-01-30', '19:30')
            }
        })
    })
}
