import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
});

router.post("/add_degustacao", upload.single("Imagem"), (req, res) => {
  const sql = `INSERT INTO degustacao 
    (Data_Degustacao,Nota_Degustacao, idDegustador, Receita_nome, idCozinheiro, Imagem) 
    VALUES (?)`;
  const values = [
    req.body.Data_Degustacao,
    req.body.Nota_Degustacao,
    req.body.idDegustador,
    req.body.Receita_nome,
    req.body.idCozinheiro,
    req.file ? req.file.filename : null,
  ];
  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true });
  });
});

router.get("/degustacao", (req, res) => {
  const sql = `
  SELECT d.*, f.Nome AS Degustador, r.nome AS Receita_nome, r.idCozinheiro AS Cozinheiro
  FROM degustacao d 
  JOIN funcionario f ON d.idDegustador = f.idFuncionario
  JOIN receita r ON d.Receita_nome = r.nome AND d.idCozinheiro = r.idCozinheiro`;

  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true, Result: result });
  });
});

router.delete(
  "/delete_degustacao/:idDegustador/:Receita_nome/:idCozinheiro",
  (req, res) => {
    const Receita_nome = req.params.Receita_nome;
    const idCozinheiro = req.params.idCozinheiro;
    const idDegustador = req.params.idDegustador;
    const sql =
      "DELETE from degustacao WHERE idDegustador=? AND Receita_nome=? AND idCozinheiro=?";
    const values = [idDegustador, Receita_nome, idCozinheiro];
    con.query(sql, values, (err, result) => {
      if (err) return res.json({ Status: false, Error: err });
      return res.json({ Status: true, Result: result });
    });
  }
);

router.get(
  "/degustacao/:idDegustador/:Receita_nome/:idCozinheiro",
  (req, res) => {
    const Receita_nome = req.params.Receita_nome;
    const idCozinheiro = req.params.idCozinheiro;
    const idDegustador = req.params.idDegustador;
    const sql =
      "SELECT * FROM degustacao WHERE idDegustador=? AND Receita_nome=? AND idCozinheiro=?";
    con.query(
      sql,
      [idDegustador, Receita_nome, idCozinheiro],
      (err, result) => {
        if (err) return res.json({ Status: false, Error: err });
        return res.json({ Status: true, Result: result });
      }
    );
  }
);

router.put(
  "/edit_degustacao/:idDegustador/:Receita_nome/:idCozinheiro",upload.single("Imagem"),
  (req, res) => {
    const idDegustador = req.params.idDegustador;
    const Receita_nome = req.params.Receita_nome;
    const idCozinheiro = req.params.idCozinheiro;
    const sql = `UPDATE degustacao SET Data_Degustacao=?, Nota_Degustacao=?, idDegustador=?, Receita_nome=?, idCozinheiro=?, Imagem=?  WHERE idDegustador=? AND Receita_nome=? AND idCozinheiro=?`;
    const values = [
      req.body.Data_Degustacao,
      req.body.Nota_Degustacao,
      req.body.idDegustador,
      req.body.Receita_nome,
      req.body.idCozinheiro,
      req.file ? req.file.filename : null,
      idDegustador,
      Receita_nome,
      idCozinheiro,
    ];
    con.query(sql, values, (err, result) => {
      if (err) return res.json({ Status: false, Error: err });
      return res.json({ Status: true, Result: result });
    });
  }
);

export { router as tasterRouter };
