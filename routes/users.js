import express from "express"
import { dbQuery, dbRun } from "../database.js";

const router = express.Router();

router.get("/", async (req,res,next) =>{
    try {
        const users = await dbQuery("SELECT * FROM users;")
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
})
router.get("/:id", async (req,res,next) =>{
    try {
        const [user] = await dbQuery("SELECT * FROM users WHERE id = ?;", [req.params.id]);
        if (!user) return res.status(404).json({message: "User not found"});
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
})
router.post("/", async (req,res,next) => {
    try {
        const result = await dbRun("INSERT INTO users (firstname, lastname, email, class) VALUES (?, ?, ?, ?);", [req.body.firstname, req.body.lastname, req.body.email, req.body.class]);
        res.status(201).json({ id: result.lastID, ...req.body });
    } catch (err) {
        next(err)
    }
})
router.put("/:id", async (req, res, next) => {
    try {
        const [user] = await dbQuery("SELECT * FROM users WHERE id = ?;", [req.params.id]);
        if (!user) return res.status(404).json({ message: "User not found" });

        await dbRun("UPDATE users SET firstname = ?, lastname = ?, email = ?, class = ? WHERE id = ?;", 
            [req.body.firstname, req.body.lastname, req.body.email, req.body.class, req.params.id]);
        res.status(200).json({ id: req.params.id, firstname: req.body.firstname || user.firstname, lastname: req.body.lastname || user.lastname, email: req.body.email || user.email, class: req.body.class || user.class});
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const [user] = await dbQuery("SELECT * FROM users WHERE id = ?;", [req.params.id]);
        if (!user) return res.status(404).json({ message: "User not found" });

        await dbRun("DELETE FROM users WHERE id = ?;", [req.params.id]);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});


export default router;