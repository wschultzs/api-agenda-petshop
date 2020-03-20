const moment = require("moment")

const conexao = require("../infra/conexao")

class Atendimento {
    create(atendimento, res) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        const sql = 'INSERT INTO Atendimentos SET ?'

        const validaData = moment(data).isSameOrAfter(dataCriacao)
        const validaCliente = atendimento.cliente.length >= 5

        const validacoes = [
            {
                nome: 'data',
                valido: validaData,
                mensagem: 'Data deve ser maior ou igual à data atual'
            },
            {
                nome: 'cliente',
                valido: validaCliente,
                mensagem: 'Cliente deve ter 5 ou mais caracteres'
            }
        ]

        const erros = validacoes.filter(val => !val.valido)
        const existemErros = erros.length

        if (existemErros) res.status(400).json(erros)
        else {

            const atendimentoDatado = { ...atendimento, dataCriacao, data }

            conexao.query(sql, atendimentoDatado, (err, result) => {
                if (err) res.status(400).json(err)
                else res.status(201).json(result)
            })
        }
    }

    list(res) {
        const sql = "SELECT * FROM Atendimentos"

        conexao.query(sql, (err, resultados) => {
            if (err) res.status(400).json(err) 
            else res.status(200).json(resultados)
        })
    }

    show(id, res) {
        const sql = `SELECT * FROM Atendimentos WHERE id = ${id}`

        conexao.query(sql, (err, resultados) => {
            const atendimento = resultados[0]
            if (err) res.status(400).json(err)
            else res.status(200).json(atendimento)
        })
    }

    update(id, values, res) {
        if (values.data) values.data = moment(values.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        const sql = 'UPDATE Atendimentos SET ? WHERE id = ?'

        conexao.query(sql, [values, id], (err, result) => {
            if (err) res.status(400).json(err)
            else res.status(200).json(result)
        })
    }

    destroy(id, res) {
        const sql = `DELETE FROM Atendimentos WHERE id = ${id}`

        conexao.query(sql, (err, result) => {
            if(err) res.status(400).json(err)
            else res.status(200).json({id})
        })
    }
}

module.exports = new Atendimento