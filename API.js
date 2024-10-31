import express from "express";
import pg from "pg";
import cors from "cors";
import env from "dotenv";

env.config();

const app = express();
const port = 3000;

const db = new pg.Client({
    connectionString: process.env.PG_URL,
});
db.connect();

app.use(cors());

app.get("/add-user", async (req, res) => {
    const usuario = req.query.usuario;
    console.log(usuario);

    const result = await db.query(
        "SELECT usuario FROM todolistAPIuser WHERE usuario = $1",
        [usuario]
    );
    const data = result.rows;

    console.log(data);

    if (!data.length > 0) {
        db.query("INSERT INTO todolistAPIuser (usuario) VALUES($1)", [usuario]);
        res.json("Usuário criado");
    } else {
        res.json("Usuário já existe");
    }
});

app.get("/login", async (req, res) => {
    const usuario = req.query.usuario;
    console.log(usuario);

    const result = await db.query(
        "SELECT * FROM todolistAPI WHERE usuario = $1",
        [usuario]
    );
    const data = result.rows;

    console.log(data);
    res.json(data);
});

app.get("/new", async (req, res) => {
    const tarefa = req.query.tarefa;
    const usuario = req.query.usuario;

    const result = await db.query(
        "INSERT INTO todolistAPI (tarefa, usuario) VALUES($1,$2) RETURNING *",
        [tarefa, usuario]
    );
    const data = result.rows;

    res.json(data);
});

app.get("/delete", (req, res) => {
    const id = Number(req.query.id);
    db.query("DELETE FROM todolistAPI WHERE id = $1", [id]);
});

app.listen(port, () => {
    console.log(`API on port ${port}`);
});
