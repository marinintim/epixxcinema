const db = require('level')('../cinema.db')

module.exports = function getFilm({params: {id}}, res) {
    db.get(id, {encoding: 'json'}, (err, data) => {
        if (err) {
            console.error(err)
            return res.send('error')
        }

        res.json(data)
    })
}
