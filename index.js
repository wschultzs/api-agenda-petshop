const customExpress = require("./config/customExpress")
const Tabelas = require("./infra/tabelas")

const port = 3001

// Starta a conexão com o banco
const conexao = require("./infra/conexao")
conexao.connect(erro => {
    if (erro) console.log(erro)
    else {
        console.log('Conectado ao banco de dados')

        Tabelas.init(conexao)

        const app = customExpress()

        app.listen(3001, () => {
            console.log(`Servidor iniciado na porta ${port}`)
        })
    }
})

