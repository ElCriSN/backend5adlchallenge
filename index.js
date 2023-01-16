const express = require('express')
const app = express()
app.listen(3000, console.log('Server ON 😀 '))

const { getJewels, getJewelsByFilter, prepareHATEOAS, reportQuery } = require('./queries')

app.get('/joyas', reportQuery, async (req, res) => {
  try {
    const queryStrings = req.query
    const jewels = await getJewels(queryStrings);
    const HATEOAS = await prepareHATEOAS(jewels)
    res.json(HATEOAS)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.get('/joyas/filtros', reportQuery, async (req, res) => {
  try {
    const queryStrings = req.query
    const jewels = await getJewelsByFilter(queryStrings)
    res.json(jewels)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.get("*", reportQuery, (req, res) => {
  res.status(404).send("Esta Ruta no Existeee =)!!")
})
