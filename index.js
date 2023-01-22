const { getJewels, getJewelsByFilter, prepareHATEOAS } = require('./queries')
const { reportarConsulta } = require('./middlewares/reportarconsulta')
const express = require('express')
const app = express()

app.use(express.json())
app.listen(3000, () => { console.log("SERVER OOOON =DD!") })

app.get("/joyas", reportarConsulta, async (req, res) => {
    try {
        const joyas = await getJewels(req.query)
        const HATEOAS = await prepareHATEOAS(joyas)
        res.json(HATEOAS)
    } catch (err) {
        res.status(500).send(err)
    }

})

app.get("/joyas/filtros", reportarConsulta, async (req, res) => {
    try {
        const joyas = await getJewelsByFilter(req.query)
        res.json(joyas)
    } catch (err) {
        res.status(500).send(err)
    }
})