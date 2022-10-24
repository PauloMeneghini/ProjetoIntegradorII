const path = require('path');
const express = require('express');
const app = express();
const oracledb = require('oracledb');
const bodyParser = require('body-parser');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.initOracleClient({libDir: 'C:\\oracle\\instantclient_21_6'});

let conn;

async function connection() {

  try {

    conn = await oracledb.getConnection( {
      user: "ADMIN", 
      password: "Paulo89Da4145!", 
      connectionString: "ra22897938db_high"
    });

    console.log ('Conectado com o DB!');

  } catch (err) {

    console.log ('Não foi possível estabelecer conexão com o BD!');
    console.error(err);

  }
  
  return conn;

}

/* function User (nome, email, senha){

  this.nome = nome;
  this.email = email;
  this.senha = senha;

}

function CadUsers(connection){
  this.conn = connection;

  this.incluir = async function (veiculo){
    const conexao = await this.conn.getConexao();

    const insert = "INSERT INTO PASSAGEIROS (CODIGO, NOME, EMAIL, SENHA, CELULAR) VALUES (SEQ_PASSAGEIROS.NEXTVAL, :0, :1, :2, '0');";

    await conexao.execute(insert);

    const commit = "COMMIT";

    await conexao.execute(commit);
  }
}

async function cadastrar(req, res) {
  const user = new User (req.body.nome, req.body.email, req.body.senha);

  try{
    await global.CadUsers.incluir(user);
    console.log("Cadastrado com sucesso!");
  }
  catch(erro){
    console.log("Erro ao cadastrar!");
  }
} */

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.render("index");
});

app.post('/cadUser', function (req, res){
  //res.send(`Nome: ${req.body.nome} <br>Email: ${req.body.emailCadastro} <br>Senha: ${req.body.senhaCadastro}`);

  const nome = req.body.nome;
  const email = req.body.emailCadastro;
  const senha = req.body.senhaCadastro;

  connection();

  res.send(`Nome: ${nome} <br>Email: ${email} <br>Senha: ${senha}`);

  const selectDB = "SELECT * FROM PASSAGEIROS";

  ret = conn.execute(selectDB);

  console.log(ret.rows);

});


async function geraBilhete()
{
  conn = await oracledb.getConnection( {
    user: "ADMIN", 
    password: "Paulo89Da4145!", 
    connectionString: "ra22897938db_high"
  });

  const insert = "INSERT INTO BILHETES (CODIGO, DATA_GERACAO) VALUES (SEQ_BILHETES.NEXTVAL, SYSDATE)";

  await conn.execute(insert);

  const commit = "COMMIT";

  await conn.execute(commit);

  console.log("Bilhete gerado");
}

console.log("Servidor rodando na porta 4000");
app.listen(4000);