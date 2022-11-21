const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const session = require('express-session')

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use('/public', express.static(path.join(__dirname, 'public')))

app.use(session({ secret: 'u6e7e7e57e5735u656i4eifkygfye' }))

function BD() {
  process.env.ORA_SDTZ = 'UTC-3' // garante horário de Brasília

  this.getConexao = async function () {
    if (global.conexao) return global.conexao

    const oracledb = require('oracledb')
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT
    oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_21_6' })

    try {
      global.conexao = await oracledb.getConnection({
        user: 'ADMIN',
        password: 'Paulo89Da4145!',
        connectionString: 'ra22897938db_high'
      })
    } catch (erro) {
      console.log('Não foi possível estabelecer conexão com o Banco de dados')
      process.exit(1)
    }

    return global.conexao
  }
}

// gerar e incluir bilhete

function Bilhetes(bd) {
  this.bd = bd

  this.inclua = async function (bilhete) {
    try {
      const conexao = await this.bd.getConexao()
      const dados = [bilhete.codigo, bilhete.tipo, bilhete.idUser]
      const dadosRecarga = [bilhete.tipo, bilhete.codigo]

      const insert =
        'INSERT INTO BILHETES (CODIGO, TIPO, DATA_GERACAO, USUARIO) VALUES (:codigo, :tipo, CURRENT_DATE, :usuario)'

      await conexao.execute(insert, dados)

      const insertRecarga =
        "INSERT INTO RECARGAS (CODIGO, TIPO, DATA_COMPRA, ATIVO, BILHETE) VALUES (SEQ_RECARGAS.NEXTVAL, :tipo, CURRENT_DATE, 'T', :codigo)"

      await conexao.execute(insertRecarga, dadosRecarga)

      const commit = 'COMMIT'
      await conexao.execute(commit)

      return (mensagem =
        'Bilhete gerado com sucesso<br> Você será redirecionado para tela de bilhetes')
    } catch (erro) {
      console.error(erro)
    }
  }

  this.utiliza = async function (codigoBilhete) {
    try {
      const conexao = await this.bd.getConexao()

      const update = "UPDATE BILHETES SET TIPO = ' ' WHERE CODIGO = :codigo"

      const dados = [codigoBilhete.codigo]

      await conexao.execute(update, dados)

      const commit = 'COMMIT'
      await conexao.execute(commit)

      return (mensagem =
        'Bilhete utilizado com sucesso <br> A página será recarregada')
    } catch (erro) {
      console.error(erro)
    }
  }

  this.recarrega = async function (bilhete) {
    try {
      const conexao = await this.bd.getConexao()

      const dados = [bilhete.tipo, bilhete.codigo]

      const insert =
        "INSERT INTO RECARGAS (CODIGO, TIPO, DATA_COMPRA, ATIVO, BILHETE) VALUES (SEQ_RECARGAS.NEXTVAL, :tipo, CURRENT_DATE, 'T', :codigo)"

      await conexao.execute(insert, dados)

      const update = 'UPDATE BILHETES SET TIPO = :tipo WHERE CODIGO = :codigo'

      await conexao.execute(update, dados)

      const commit = 'COMMIT'
      await conexao.execute(commit)

      return (mensagem = `Bilhete ${bilhete.codigo} recarregado <br> A página será recarregada`)
    } catch (erro) {
      console.error(erro)

      return (mensagem = 'Erro ao recarregar bilhete')
    }
  }
}

function Bilhete(codigo, tipo, data_geracao, idUser) {
  this.codigo = codigo
  this.tipo = tipo
  this.data_geracao = data_geracao
  this.idUser = idUser
}

function Comunicado(codigo, tipo, mensagem, resposta) {
  this.codigo = codigo
  this.tipo = tipo
  this.mensagem = mensagem
  this.resposta = resposta
}

/* cadastro usuario */

function Usuarios(bd) {
  this.bd = bd

  this.inclua = async function (usuario) {
    try {
      const conexao = await this.bd.getConexao()
      let mensagem

      const selectEmailCount = 'SELECT EMAIL FROM USUARIOS WHERE EMAIL = :email'
      const dadoEmailCount = [usuario.email]

      resultadoEmailCount = await conexao.execute(
        selectEmailCount,
        dadoEmailCount
      )

      console.log(resultadoEmailCount.rows.length)

      if (resultadoEmailCount.rows.length > 0) {
        console.log(`O email ${usuario.email} já está cadastrado`)

        mensagem = 'EMAIL JÁ CADASTRADO!'

        return mensagem
      } else {
        const insert =
          'INSERT INTO USUARIOS (CODIGO, NOME, EMAIL, SENHA, CELULAR, DATA_CADASTRO) VALUES (SEQ_USUARIOS.NEXTVAL, :nome, :email, :senha, :celular, CURRENT_DATE)'

        const dados = [
          usuario.nome,
          usuario.email,
          usuario.senha,
          usuario.celular
        ]

        await conexao.execute(insert, dados)

        const commit = 'COMMIT'
        await conexao.execute(commit)

        const select =
          "SELECT CODIGO, NOME, EMAIL, SENHA, CELULAR, TO_CHAR(DATA_CADASTRO, 'YYYY-MM-DD HH24:MI:SS') FROM USUARIOS WHERE CELULAR = :celular"

        const dadosSelect = [usuario.celular]
        ret = await conexao.execute(select, dadosSelect)
        console.log(ret.rows)

        mensagem = 'Usuário cadastrado com sucesso'

        return mensagem, ret.rows
      }
    } catch (erro) {
      console.error(erro)
    }
  }
}

function Usuario(nome, email, senha, celular) {
  this.nome = nome
  this.email = email
  this.senha = senha
  this.celular = celular
}

/*function middleWareGlobal(req, res, next) {
    console.time("Requisição"); // marca o início da requisição
    console.log("Método: " + req.method + "; URL: " + req.url); // retorna qual o método e url foi chamada
  
    next(); // função que chama as próximas ações
  
    console.log("Finalizou"); // será chamado após a requisição ser concluída
  
    console.timeEnd("Requisição"); // marca o fim da requisição
}*/

async function inclusao(req, res) {
  const codigo = new Date().getTime()
  const bilhete = new Bilhete(
    codigo,
    req.body.tipo,
    req.body.data_geracao,
    req.session.idUser
  )

  try {
    const resposta = await global.bilhetes.inclua(bilhete)

    return res.status(201).json(resposta)
  } catch (erro) {
    console.error(erro)
  }
}

async function inclusaoUsuario(req, res) {
  const senhaCriptografada = await bcrypt.hash(req.body.senhaCadastro, 10) //10 quer dizer que mesmo que a senha seja igual para usuários diferentes a criptografia vai ser a mesma

  const email = req.body.emailCadastro.toLowerCase()
  const nome = req.body.nomeUsuario
  const celular = req.body.celularCadastro

  const usuario = new Usuario(nome, email, senhaCriptografada, celular)

  try {
    const sucesso = await global.usuarios.inclua(usuario)

    return res.status(201).json(sucesso)

    //return res.status(201).redirect("/recarga");
  } catch (erro) {
    console.error(erro)
  }
}

async function realizaLogin(req, res) {
  this.bd = new BD()

  try {
    await this.bd.getConexao()

    const email = req.body.emailLogin
    const senha = req.body.senhaLogin

    const selectLogin = 'SELECT * FROM USUARIOS WHERE EMAIL = :email'

    const dadoLogin = [email]

    resultadoUsuario = await conexao.execute(selectLogin, dadoLogin)

    if (
      email == resultadoUsuario.rows[0].EMAIL &&
      (await bcrypt.compare(senha, resultadoUsuario.rows[0].SENHA))
    ) {
      //app.use(session({ secret: 'keyboard cat' }));

      req.session.nome = resultadoUsuario.rows[0].NOME
      req.session.email = resultadoUsuario.rows[0].EMAIL
      req.session.idUser = resultadoUsuario.rows[0].CODIGO

      res.redirect('/mostraBilhete')
    } else {
      res.status(401).json('Erro ao logar')
    }
  } catch (erro) {
    console.error
  }
}

async function utilizaBilhete(req, res) {
  const codigoBilhete = new Bilhete(req.body.codigo)

  try {
    const resposta = await global.bilhetes.utiliza(codigoBilhete)

    return res.status(201).json(resposta)
  } catch (erro) {
    console.error(erro)
  }
}

async function recarregarBilhete(req, res) {
  const bilhete = new Bilhete(req.body.codigoBilhete, req.body.recarga)

  console.log(bilhete)

  try {
    const resposta = await global.bilhetes.recarrega(bilhete)

    return res.status(201).json(resposta)
  } catch (erro) {
    console.error(erro)
  }
}

async function ativacaoServidor() {
  const bd = new BD()

  global.bilhetes = new Bilhetes(bd)

  global.usuarios = new Usuarios(bd)

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use(express.json()) // faz com que o express consiga processar JSON
  app.use(cors()) //habilitando cors na nossa aplicacao (adicionar essa lib como um middleware da nossa API - todas as requisições passarão antes por essa biblioteca).
  //app.use(middleWareGlobal); // app.use cria o middleware global

  app.get('/', function (req, res) {
    res.render('index')
  })

  app.get('/login', function (req, res) {
    res.render('login')
  })

  app.post('/login', realizaLogin)

  app.get('/mostraBilhete', function (req, res) {
    if (req.session.nome) {
      let resultado

      async function consultaBilhete() {
        const bd = new BD()

        bd.getConexao()

        const selectBilhete =
          'SELECT * FROM BILHETES WHERE USUARIO = :codUsuario ORDER BY CODIGO ASC'

        const dadosBilhete = [req.session.idUser]

        resultado = await conexao.execute(selectBilhete, dadosBilhete)

        console.log(resultado.rows)

        tamanhoOBJ = resultado.rows.length

        bilhete = resultado.rows

        tipoBilhete = resultado.rows

        res.render('mostraBilhete', {
          nome: req.session.nome,
          bilhete: bilhete,
          tipoBilhete: tipoBilhete,
          tamanhoOBJ: tamanhoOBJ
        })
      }

      consultaBilhete()
    }
  })

  app.get('/recarga', function (req, res) {
    res.render('recarga')
  })

  app.post('/recarga', recarregarBilhete)

  app.get('/termo', function (req, res) {
    res.render('termo')
  })

  app.get('/pagamento', function (req, res) {
    res.render('pagamento')
  })

  app.get('/cadCartao', function (req, res) {
    res.render('cadCartao')
  })

  app.post('/bilhete', inclusao)

  app.post('/cadUser', inclusaoUsuario)

  app.get('/utilizaBilhete', function (req, res) {
    if (req.session.idUser) {
      res.render('utilizaBilhete')
    }
  })

  app.post('/utilizaBilhete', utilizaBilhete)

  console.log('Servidor ativo na porta 4000...')
  app.listen(4000)
}
//cria bd e chama função bd()

ativacaoServidor()
