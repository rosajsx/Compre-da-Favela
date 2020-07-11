const express = require("express")
const server = express()

//pegar o b

//configurar pasta publica
server.use(express.static("public"))

//habilitar o uso do req.body na nossa aplicacao
server.use(express.urlencoded({ extended: true }))


//configurar caminhos da minha aplicacao
//pagina inicial
//req: requisicao
//res: resposta
server.get("/", (req, res) => {
    return res.render("index.html", { title: "Um título" })
})

server.get("/index", (req, res) => {
    return res.render("index.html", { title: "Um título" })
})



server.get("/cadastro", (req, res) => {

    //req.query: Query Strings da nossa url
    // console.log(req.query)

    return res.render("cadastro.html")
})

server.post("/negocios", (req, res) => {
    //req.body: o corpo do nosso formulario
    // console.log(req.body)

    //inserir dados no banco de dados
    const query = `
       INSERT INTO places (
           image,
           name,
           address,
           address2,
           state,
           city,
           items
       ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            console.log(err)
            return res.send("Erro no cadastro")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("cadastro.html", { saved: true })
    }

    db.run(query, values, afterInsertData)
})

server.get("/negocios", (req, res) => {
    const search = req.query.search
    if (search == "") {
        //pesquisa vazia
        return res.render("negocios.html", { total: 0 })
    }

    //pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
        if (err) {
            return console.log(err)
        }

        const total = rows.length

        //mostrar a pagina html com os dados do banco de dados
        return res.render("search-results.html", { places: rows, total: total })
    })
})

//ligar o servidor
server.listen(3000)