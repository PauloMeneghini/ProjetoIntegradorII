function BD()
{

    process.env.ORA_SDTZ = "UTC-3"; // garante horário de Brasília

    this.getConexao = async function()
    {
        if (global.conexao)
            return global.conexao;
        
        const oracledb = require('oracledb');
        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_21_6' });

        try
        {
            global.conexao = await oracledb.getConnection({
                user: "ADMIN", 
				password: "Paulo89Da4145!", 
				connectionString: "ra22897938db_high"
            });
        }
        catch (erro)
        {
            console.log('Não foi possível estabelecer conexão com o Banco de dados');
            process.exit(1);
        }

        return global.conexao;
    };
}

// gerar e incluir bilhete

function Bilhetes(bd)
{
    this.bd = bd;

    this.inclua = async function (bilhete)
    {
        try{

            const conexao = await this.bd.getConexao();
    
            const insert = "INSERT INTO BILHETES (CODIGO, TIPO, DATA_GERACAO) VALUES (:0, :1, CURRENT_DATE)";
    
            const dados = [bilhete.codigo, bilhete.tipo];
    
            await conexao.execute(insert, dados);
    
            const commit = "COMMIT";
            await conexao.execute(commit);
    
            const select = "SELECT CODIGO, TIPO, TO_CHAR(DATA_GERACAO, 'YYYY-MM-DD HH24:MI:SS') FROM BILHETES WHERE CODIGO = :0";
    
            const dadosSelect = [bilhete.codigo];
            ret = await conexao.execute(select, dadosSelect);
            console.log(ret.rows);
    
            return ret.rows;

        }
        catch (erro)
        {

            console.error(erro);

        }
    }
}

function Bilhete(codigo, tipo, data_geracao)
{
    this.codigo = codigo;
    this.tipo = tipo;
    this.data_geracao = data_geracao;
}

function Comunicado(codigo, tipo, mensagem, resposta)
{
    this.codigo = codigo;
    this.tipo = tipo;
    this.mensagem = mensagem;
    this.resposta = resposta;
}

/* cadastro usuario */

function Usuarios(bd)
{
    this.bd = bd;

    this.inclua = async function (usuario)
    {
        try{
            const conexao = await this.bd.getConexao();
            let mensagem;

            const selectCount = "SELECT EMAIL FROM USUARIOS WHERE EMAIL = :email";
            const dadoCount = [usuario.email];

            resultadoCount = await conexao.execute(selectCount, dadoCount);


            console.log(resultadoCount.rows.length);


            if(resultadoCount.rows.length > 0) {

                console.log(`O email ${usuario.email} já está cadastrado`);

                mensagem = "EMAIL JÁ CADASTRADO!";

                return mensagem;

            } else {

                const insert = "INSERT INTO USUARIOS (CODIGO, NOME, EMAIL, SENHA, DATA_CADASTRO) VALUES (SEQ_USUARIOS.NEXTVAL, :nome, :email, :senha, CURRENT_DATE)";
        
                const dados = [usuario.nome, usuario.email, usuario.senha];
        
                await conexao.execute(insert, dados);
        
                const commit = "COMMIT";
                await conexao.execute(commit);
        
                const select = "SELECT CODIGO, NOME, EMAIL, SENHA, TO_CHAR(DATA_CADASTRO, 'YYYY-MM-DD HH24:MI:SS') FROM USUARIOS WHERE NOME = :0";
        
                const dadosSelect = [usuario.nome];
                ret = await conexao.execute(select, dadosSelect);
                console.log(ret.rows);
        
                mensagem = "Usuário cadastrado com sucesso";

                return mensagem, ret.rows;


            } 

        }
        catch (erro)
        {

            console.error(erro);

        }
    }
}

function Usuario(nome, email, senha)
{
    this.nome = nome;
    this.email = email;
    this.senha = senha;
}

/*function middleWareGlobal(req, res, next) {
    console.time("Requisição"); // marca o início da requisição
    console.log("Método: " + req.method + "; URL: " + req.url); // retorna qual o método e url foi chamada
  
    next(); // função que chama as próximas ações
  
    console.log("Finalizou"); // será chamado após a requisição ser concluída
  
    console.timeEnd("Requisição"); // marca o fim da requisição
}*/

async function inclusao(req, res)
{
    const codigo = new Date().getTime();
    const bilhete = new Bilhete(codigo, req.body.tipo, req.body.data_geracao);

    try
    {
        const resposta = await global.bilhetes.inclua(bilhete);
        const sucesso = new Comunicado(
            "Número bilhete: " + bilhete.codigo,
            "Tipo: " + bilhete.tipo,
            "O bilhete foi gerado com sucesso",
            resposta
        );

        
        return res.status(201).json(sucesso);
    }
    catch (erro)
    {
        console.error(erro);
        console.log("TESTE AQUI");
    }
}

async function inclusaoUsuario(req, res)
{

    const bcrypt = require('bcrypt');
    const senhaCriptografada = await bcrypt.hash(req.body.senhaCadastro, 10); //10 quer dizer que mesmo que a senha seja igual para usuários diferentes a criptografia vai ser a mesma

    const email = req.body.emailCadastro.toLowerCase();

    const nome = req.body.nomeUsuario;

    const usuario = new Usuario(nome, email, senhaCriptografada);
      
    try
    {
        const sucesso = await global.usuarios.inclua(usuario);

        return res.status(201).json(sucesso);

        //return res.status(201).redirect("/recarga");

    }
    catch (erro)
    {
        console.error(erro);
    }
    
}

async function ativacaoServidor()
{
    const bd = new BD();
    
    global.bilhetes = new Bilhetes(bd);

    global.usuarios = new Usuarios(bd);

    const express = require("express");
    const app = express();
    const cors = require("cors");
    const path = require('path');
    const bodyParser = require('body-parser');

    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use('/public', express.static(path.join(__dirname, 'public')));

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use(express.json()); // faz com que o express consiga processar JSON
    app.use(cors()); //habilitando cors na nossa aplicacao (adicionar essa lib como um middleware da nossa API - todas as requisições passarão antes por essa biblioteca).
    //app.use(middleWareGlobal); // app.use cria o middleware global

    app.get('/', function(req, res){
        res.render("index");
    });

    app.get('/login', function(req, res){
        res.render("login");
    });
    
    app.get('/mostraBilhete', function(req, res){
        res.render("mostraBilhete");
    });
    
    
    app.get('/recarga', function(req, res){
        res.render("recarga");
    });
    
    
    app.get('/termo', function(req, res){
        res.render("termo");
    });
    
    app.get('/pagamento', function(req, res){
        res.render("pagamento");
    });

    app.get('/cadCartao', function(req, res){
        res.render("cadCartao");
    });
    
    app.post('/bilhete', inclusao);

    app.post('/cadUser', inclusaoUsuario);

    app.get('/utilizaBilhete', function(req, res) {
        res.render("utilizaBilhete");
    });

    console.log("Servidor ativo na porta 4000...");
    app.listen(4000);
}
  //cria bd e chama função bd()
  
ativacaoServidor();