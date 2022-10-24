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

    this.estruturaSe = async function()
    {
        try
        {
            const conexao = await this.getConexao();

            const sql = "CREATE TABLE BILHETES (CODIGO NUMBER NOT NULL PRIMARY KEY, TIPO VARCHAR2(10) NOT NULL, DATA_GERACAO DATE NOT NULL)";

            await conexao.execute(sql);

        }
        catch (erro)
        {
        }
    };
}

function Bilhetes(bd)
{
    this.bd = bd;

    this.inclua = async function (bilhete)
    {
        try{

            const conexao = await this.bd.getConexao();
    
            const insert = "INSERT INTO BILHETES (CODIGO, TIPO, DATA_GERACAO) VALUES (:0, :1, sysdate)";
    
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

function Comunicado(codigo, mensagem, descricao, resposta)
{
    this.codigo = codigo;
    this.mensagem = mensagem;
    this.descricao = descricao;
    this.resposta = resposta;
}


function middleWareGlobal(req, res, next) {
    console.time("Requisição"); // marca o início da requisição
    console.log("Método: " + req.method + "; URL: " + req.url); // retorna qual o método e url foi chamada
  
    next(); // função que chama as próximas ações
  
    console.log("Finalizou"); // será chamado após a requisição ser concluída
  
    console.timeEnd("Requisição"); // marca o fim da requisição
}

async function inclusao(req, res)
{
    const codigo = new Date().getTime();
    const bilhete = new Bilhete(codigo, req.body.tipo, req.body.data_geracao);

    try
    {
        const resposta = await global.bilhetes.inclua(bilhete);
        const sucesso = new Comunicado(
            "GBS",
            "Geração bem sucedida",
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

async function ativacaoServidor()
{
    const bd = new BD();
    await bd.estruturaSe();
    global.bilhetes = new Bilhetes(bd);

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
    app.use(middleWareGlobal); // app.use cria o middleware global

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
    
    app.post("/bilhete", inclusao);
    //app.post('/cadastrar', cadastrarUsusario);

    console.log("Servidor ativo na porta 4000...");
    app.listen(4000);
  }
  //cria bd e chama função bd()
  
  ativacaoServidor();