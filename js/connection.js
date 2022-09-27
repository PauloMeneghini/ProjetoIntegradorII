const oracledb = require('oracledb');

const email = document.getElementById('emailCadastro');
const senha = document.getElementById('senhaCadastro');
const confirmaSenha = document.getElementById('confirmaSenhaCadastro');


oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_21_6' });

async function run() {

  let connection;

  try {

    connection = await oracledb.getConnection({ user: "", password: "", connectionString: "" });

    console.log("Conectado!");

    console.log(`Email: ${email}`);
    console.log(`Senha: ${senha}`);
    console.log(`Confirma senha: ${confirmaSenha}`);

    /*const sql = `INSERT INTO nodetab VALUES (:1, :2)`;

    const binds =
      [ [1, "First" ],
        [2, "Second" ],
        [3, "Third" ],
        [4, "Fourth" ],
        [5, "Fifth" ],
        [6, "Sixth" ],
        [7, "Seventh" ] ];

    await connection.executeMany(sql, binds);

    // connection.commit();     // uncomment to make data persistent

    // Now query the rows back

    const result = await connection.execute(`SELECT * FROM nodetab`);

    console.dir(result.rows, { depth: null }); */

  } catch (err) {

    console.error(err);

  } 
}

run();