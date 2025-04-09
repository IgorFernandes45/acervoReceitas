import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config(); 

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'senac',
  port: 3306,
  database: 'acervo_receita_case',
});

con.connect(function (err) {
  if (err) {
    console.error("Connection error:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

export default con;