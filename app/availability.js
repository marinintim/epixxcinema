const db = require('level')('../cinema.db')

module.exports = function getAvailability({params: {film, date, time}}, res) {
    db.get(film, function(err, data) {
        if (err) {
            console.error(err)
            return res.send('error')
        }

        const scr = data.screenings
        if (scr[date] && scr[date][time]) {
            res.json(scr[date][time])
        } else res.end('0')
    })
}
