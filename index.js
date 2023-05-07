const PORT = process.env.PORT || 8000;
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [{
    name: 'tyc',
    address: 'https://www.tycsports.com/',
    base: 'https://www.tycsports.com/'
},
{
    name: 'asargentina',
    address: 'https://argentina.as.com',
    base: ''
},
{
    name: 'elgrafico',
    address: 'https://www.elgrafico.com.ar',
    base: 'https://www.elgrafico.com.ar'
},
{
    name: 'lanacion',
    address: 'https://www.lanacion.com.ar',
    base: 'https://www.lanacion.com.ar'
},
{
    name: 'clarin',
    address: 'https://www.clarin.com/deportes/',
    base: ''
},
{
    name: 'futbolargentino',
    address: 'https://www.futbolargentino.com/',
    base: 'https://www.futbolargentino.com'
},
{
    name: 'ole',
    address: 'https://www.ole.com.ar/',
    base: ''
},
{
    name: 'espn',
    address: 'https://www.espn.com.ar/futbol/',
    base: 'https://www.espn.com.ar'
},
{
    name: 'BolaVip',
    address: 'https://bolavip.com/ar',
    base: ''
},
{
    name: 'Rosario3',
    address: 'https://www.rosario3.com/',
    base: ''
},
{
    name: 'Lacapital',
    address: 'https://www.lacapital.com.ar/',
    base: ''
}
]

const articles = []
newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            $(`a:contains('Messi')`, html).each(function () {
                const title = $(this).text()
                const url = $(this).attr(`href`)
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })

            })
        })
})
app.get('/', (req, res) => {
    res.json('welcome to my Messi News API')
})
app.get('/news', (req, res) => {
    res.json(articles)
})
app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId
    const newspaperAdress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base
    axios.get(newspaperAdress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []
            $(`a:contains('Messi')`, html).each(function () {
                const title = $(this).text()
                const url = $(this).attr(`href`)
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })

            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
