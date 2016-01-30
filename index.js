var express = require('express')
var ecstatic = require('ecstatic')

var level = require('level')


var db = level('./cinema.db')

db.put('1', {
    id: 1,
    title: 'Звёздные войны: Пробуждение силы',
    price: 200,
    about: String.raw`
                  <p>История о мальчике  Савве десяти лет, который живёт в маленькой лесной деревне. Когда-то деревню от врагов защищали благородные белые волки.  Но однажды волки исчезли и на деревню напала банда свирепых Гиен. Савве удаётся сбежать в лес, где он знакомится с Ангой — последним белым волком. </p>
              <p>Анга  рассказывает Савве о могущественном Волшебнике, который живёт на горе и может помочь Савве освободить его деревню. Но, к сожалению, эту гору окружает огромное войско, под предводительством злобной  Мамы ЖоЗи — трёхголовой королевы обезьян. </p>
              <p>Справляясь с непреодолимыми трудностями,  Савва и  Анга начинают свой длинный и опасный путь на гору.  По пути к ним присоединяются и другие путешественники: Пусик — странное розовое пушистое существо; Фафл — самоуверенный  тип, похожий на француза, который в действительности является заколдованным полубароном и вынужден носить  на  плече короля комаров;  принцессу болотного племени  Нанти  и  других.  У  всех есть свои личные причины, чтобы идти к Волшебнику. По пути к своей цели, друзьям предстоит преодолеть множество препятствий, узнать страшные тайны и вступить в битву с войском обезьян и коварной Мамой ЖоЗи. </p>
`,
    screenings: {
        '2015-01-30': {
            '19:30': {
                '1': {
                    reserved: [ 1, 2, 5, 6, 7, 8, 9, 10 ],
                    available: [ 3, 4 ]
                },
                '2': {
                    reserved: [ 5, 6 ],
                    available: [ 1, 2, 3, 4, 7, 8, 9, 10],
                },
                '3': {
                    reserved: [ 1, 2, 9, 10],
                    available: [ 3, 4, 5, 6, 7, 8 ]
                }
            },
            '20:30': {
                '1': {
                    reserved: [ 1, 2, 5, 6,  9, 10 ],
                    available: [ 3, 4, 7, 8 ]
                },
                '2': {
                    reserved: [ 5, 6, 7, 8 ],
                    available: [ 1, 2, 3, 4, 9, 10],
                },
                '3': {
                    reserved: [ 1, 2, 9, 10],
                    available: [ 3, 4, 5, 6, 7, 8 ]
                }
            }
        }
    }
}, {encoding:'json'})

var app = express()
var hbs = require('hbs')
hbs.registerPartials('views')
hbs.registerHelper('json', function(ctx, opts) {
    console.log(ctx);
    console.log('------')
    return new hbs.SafeString(JSON.stringify(ctx))
})

app.set('view engine', 'html')
app.engine('html', hbs.__express)


app.get('/availability/:film/:date/:time', function(req, res) {
    db.get(req.params.film, function(err, data) {
        if (err) {
            console.error(err)
            return res.send('error')
        }
        
        console.log(req.params)

        if (data.screenings[req.params.date] && data.screenings[req.params.date][req.params.time]) {
            res.json(data.screenings[req.params.date][req.params.time])
        } else {
            res.end('0')
        }
    })
})

app.get('/film/:id', function(req, res) {
    db.get(req.params.id, {encoding:'json'}, function(err, data) {
        if (err) {
            console.error(err)
            return res.send('error')
        }

        res.json(data)
    })
})

app.post('/order', function(req, res) {
    res.send(JSON.stringify(req.payload))
})

function getSeatsByRow(film, date, time) {
    var rows = film.screenings[date][time]
    var seats = []
    var rowSeats
    
    for (var k in rows) {
        if (rows.hasOwnProperty(k)) {
            rowSeats = []
            seats[+k] = []
            rows[k].reserved.forEach(function(i) {
                rowSeats[i] = {
                    row: k,
                    seat: i,
                    status: 'reserved',
                    reserved: true
                }
            })
            rows[k].available.forEach(function(i) {
                rowSeats[i] = {
                    row: k,
                    seat: i,
                    status: 'available',
                    reserved: false

                }
            })
            seats[+k] = rowSeats
        }
    }

    return seats
}

app.get('/', function(req, res) {
    db.get('1', {encoding:'json'}, function(err, data) {
        if (err) {
            console.error(err)
            return res.send('error')
        }

        var renderData = {
            film: data,
            popup: {
                film: data,
                screening: {
                    title: data.title,
                    date: '2015-01-30',
                    time: '19:30',
                    price: data.price
                },
                rows: getSeatsByRow(data, '2015-01-30', '19:30') 
            }
        }
        res.render('index', renderData)
    })
})

app.get('/popup/:film/:date/:time', function(req, res) {
    db.get(req.params.film, {encoding:'json'}, function(err, data) {
        var seats = getSeatsByRow(data, req.params.date, req.params.time)
        res.render('popup', {
            film: data,
            screening: {
                title: data.title,
                date: req.params.date,
                time: req.params.time,
                price: data.price
            },
            rows: seats
        })
    })
})

app.use(ecstatic('./public'))

app.listen('8080', function() {
    console.log('started at http://localhost:8080')
})
