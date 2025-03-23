import { Request, Response } from "express";
import pool from "../models/db";
import jwt from "jsonwebtoken";
import { HashService } from "../common/hash-handler";

const JWT_SECRET = process.env.JWT_SECRET || "worisecretkey";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await HashService.hashPassword(password);
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );
    const user = result.rows[0];
    res.status(200).json({ message: "Пользователь успешно создан", user });
  } catch (error) {
    console.error("Ошибка создания пользователя:", error);
    res.status(500).json({ error: "Ошибка создания пользователя" });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    const isMatch = await HashService.verifyPassword(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Неверные данные для входа" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "10h" });
    res.status(200).json({ message: "Успешная авторизация", token });
  } catch (error) {
    console.error("Ошибка во время входа в систему:", error);
    res.status(500).json({ message: "Ошибка авторизации" });
  }
};
