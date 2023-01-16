const format = require('pg-format')
const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "0l4&nd4_ w3n0o5W",
    database: "joyas",
    port: 5432,
    allowExitOnIdle: true
});

const getJewels = async ({ limits = 10, order_by = "id_ASC", page = 1 }) => {
    const [campo, direction] = order_by.split("_");
    const offset = (page - 1) * limits
    const formattedQuery = format("SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s", campo, direction, limits, offset)
    pool.query(formattedQuery);
    const { rows: jewels } = await pool.query(formattedQuery);
    return jewels
}

const getJewelsByFilter = async ({ precio_min, precio_max, metal, categoria}) => {
    let filtros = []
    const values = []
    const agregarFiltro = (campo, comparador, valor) => {
        values.push(valor)
        const {length} = filtros
        filtros.push(`${campo} ${comparador} $${length + 1}`)
    }
    if (precio_max) agregarFiltro('precio', '<=', precio_max)
    if (precio_min) agregarFiltro('precio', '>=', precio_min)
    if (metal) agregarFiltro('metal', '=', metal)
    if (categoria) agregarFiltro('categoria', '=', categoria)

    let consulta = "SELECT * FROM inventario"

    if (filtros.length > 0) {
        filtros = filtros.join( " AND ")
        consulta += ` WHERE ${filtros}`
    }
    const { rows : joyas } = await pool.query(consulta, values)
    return joyas
}


prepareHATEOAS = (jewels) => {
    const results = jewels.map((j)=> {
        return {
            name: j.nombre,
            href: `/jewels/jewel/${j.id}`,
        }
    }).slice(0, 9)
    const total = jewels.length
    const HATEOAS = {
        total,
        results
    }
    return HATEOAS
}

const reportQuery = async (req, res, next) => {
    const parameters = req.params
    const url = req.url
    console.log(`
    Hoy ${new Date()}
    Se ha recibido una Consulta en la Ruta ${url} 😃, con los Parámetros:
    `, parameters)
    next()
}
module.exports = { getJewels, getJewelsByFilter, prepareHATEOAS, reportQuery }