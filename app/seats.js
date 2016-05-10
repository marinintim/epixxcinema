const _ = require('lodash/fp')

const reserved = _.map(function(i) {
    return {
        row: null,
        seat: i,
        status: 'reserved',
        reserved: true,
    }
})

const available = _.map(function(i) {
    return {
        row: null,
        seat: i,
        status: 'available',
        reserved: false
    }
})

module.exports = function getSeatsByRow(film, date, time) {
    return _.mapValues(function(v, k) {
        return _.chain(reserved(rows[k].reserved))
            .concat(available(rows[k].available))
            .map(v => ((v.row = +k), v))
            .sort('seat')
    }, film.screenings[date][time])
}
