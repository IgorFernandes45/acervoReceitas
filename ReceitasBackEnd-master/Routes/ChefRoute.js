import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();


router.post("/add_categoria", (req, res) => {
  const sql = "INSERT INTO categoria (`nome`) VALUES (?)";
  con.query(sql, [req.body.nome], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true });
  });
});

router.get("/categoria", (req, res) => {
  const sql = "SELECT * FROM categoria";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.delete("/delete_categoria/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE from categoria WHERE idCategoria= ?";
  con.query(sql, id, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/edit_categoria/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM categoria WHERE idCategoria=?";
  con.query(sql, id, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.put("/edit_categoria/:id", (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE categoria SET nome=? WHERE idCategoria=?`;
  const values = [req.body.nome, id];
  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_receita", (req, res) => {
  const sql = `INSERT INTO receita 
    (nome,Data,ModoPreparo, QuantidadePorcao, IndRecInedita, idCozinheiro, Categoria) 
    VALUES (?)`;
  const values = [
    req.body.nome,
    req.body.Data,
    req.body.ModoPreparo,
    req.body.QuantidadePorcao,
    req.body.IndRecInedita,
    req.body.idCozinheiro,
    req.body.idCategoria,
  ];
  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error con" + err });
    return res.json({ Status: true });
  });
});

router.get("/receita", (req, res) => {
  const sql = `
    SELECT r.*, f.Nome AS Cozinheiro, c.Nome AS Categoria 
    FROM receita r 
    JOIN funcionario f ON r.idCozinheiro = f.idFuncionario 
    JOIN categoria c ON r.Categoria = c.idCategoria`;

  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.delete("/delete_receita/:nome/:idCozinheiro", (req, res) => {
  const nome = req.params.nome;
  const idCozinheiro = req.params.idCozinheiro;
  const sql = "DELETE from receita WHERE nome=? AND idCozinheiro=?";
  const values = [nome, idCozinheiro];
  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/receita/:nome/:idCozinheiro", (req, res) => {
  const nome = req.params.nome;
  const idCozinheiro = req.params.idCozinheiro;
  const sql = "SELECT * FROM receita WHERE nome=? AND idCozinheiro=?";
  con.query(sql, [nome, idCozinheiro], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.put("/edit_receita/:nome/:idCozinheiro", (req, res) => {
  const nome = req.params.nome;
  const idCozinheiro = req.params.idCozinheiro;
  const sql = `UPDATE receita SET nome=?, Data=?, IndRecInedita=?, idCozinheiro=?, Categoria=?, QuantidadePorcao=?, ModoPreparo=?  WHERE nome=? AND idCozinheiro=?`;
  const values = [
    req.body.nome,
    req.body.Data,
    req.body.IndRecInedita,
    req.body.idCozinheiro,
    req.body.Categoria,
    req.body.QuantidadePorcao,
    req.body.ModoPreparo,
    nome,
    idCozinheiro
  ];
  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/composicao", (req, res) => {
  const sql = `
    SELECT c.*, f.Nome AS Cozinheiro, i.Nome AS Ingredientes, r.nome AS Receita_nome, m.Descricao AS Medida 
    FROM composicao c 
    JOIN funcionario f ON c.idCozinheiro = f.idFuncionario 
    JOIN ingredientes i ON c.idIngredientes = i.idIngredientes
    JOIN medida m ON c.idMedida = m.idMedida
    JOIN receita r ON c.Receita_nome = r.nome`;

  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_composicao", (req, res) => {
  const sql = `INSERT INTO composicao 
    (QuantidadeIngrediente,idMedida,idIngredientes, Receita_nome, idCozinheiro) 
    VALUES (?)`;
  const values = [
    req.body.QuantidadeIngrediente,
    req.body.idMedida,
    req.body.idIngredientes,
    req.body.Receita_nome,
    req.body.idCozinheiro
  ];
  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error con" + err });
    return res.json({ Status: true });
  });
});

router.delete("/delete_composicao/:idIngredientes/:Receita_nome/:idCozinheiro", (req, res) => {
  const idIngredientes = req.params.idIngredientes;
  const Receita_nome = req.params.Receita_nome;
  const idCozinheiro = req.params.idCozinheiro;
  
  const sql = "DELETE from composicao WHERE idIngredientes=? AND Receita_nome=? AND idCozinheiro=?";
  const values = [idIngredientes,Receita_nome, idCozinheiro];
  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/composicao/:idIngredientes/:Receita_nome/:idCozinheiro", (req, res) => {
  const { idIngredientes, Receita_nome, idCozinheiro } = req.params;
  const sql = "SELECT * FROM composicao WHERE idIngredientes = ? AND Receita_nome = ? AND idCozinheiro = ?";
  con.query(sql, [idIngredientes, Receita_nome, idCozinheiro], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});


router.put("/edit_composicao/:idIngredientes/:Receita_nome/:idCozinheiro", (req, res) => {
  const Receita_nome = req.params.Receita_nome;
  const idCozinheiro = req.params.idCozinheiro;
  const idIngredientes = req.params.idIngredientes;
  const sql = `UPDATE composicao SET QuantidadeIngrediente=?,idMedida=?,idIngredientes=?,Receita_nome=?, idCozinheiro=?  WHERE idIngredientes=? AND Receita_nome=? AND idCozinheiro=?`;
  const values = [
    req.body.QuantidadeIngrediente,
    req.body.idMedida,
    req.body.idIngredientes,
    req.body.Receita_nome,
    req.body.idCozinheiro,
    idIngredientes,
    Receita_nome,
    idCozinheiro
  ];
  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});


//get pra medida e ingredientes
router.get("/medida", (req, res) => {
  const sql = "SELECT * FROM medida";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/medida/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM medida WHERE idMedida=?";
  con.query(sql, id, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.put("/edit_medida/:id", (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE medida SET Descricao=? WHERE idMedida=?`;
  const values = [req.body.descricao, id];
  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.delete("/delete_medida/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE from medida WHERE idMedida= ?";
  con.query(sql, id, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_medida", (req, res) => {
  const sql = `INSERT INTO medida (Descricao) VALUES (?)`;
  con.query(sql, [req.body.descricao], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true });
  });
});

//get para ingredientes
router.get("/ingredientes", (req, res) => {
  const sql = "SELECT * FROM ingredientes";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/ingredientes/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM ingredientes WHERE idIngredientes=?";
  con.query(sql, id, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.put("/edit_ingrediente/:id", (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE ingredientes SET Nome=?, descricao=? WHERE idIngredientes=?`;
  const values = [req.body.Nome, req.body.descricao, id];
  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.delete("/delete_ingredientes/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE from ingredientes WHERE idIngredientes= ?";
  con.query(sql, id, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_ingrediente", (req, res) => {
  const sql = `INSERT INTO ingredientes (Nome, descricao) VALUES (?, ?)`;
  const values = [req.body.Nome, req.body.descricao];
  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true });
  });
});


export { router as chefRouter };
