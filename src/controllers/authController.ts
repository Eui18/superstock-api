import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { getUserByEmail, createUser } from "../models/userModel";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Nombre, correo y contraseña son obligatorios", data: null });
    }
    if (password.length < 6) {
      return res.status(400).json({ msg: "La contraseña debe tener al menos 6 caracteres", data: null });
    }

    const existing = await getUserByEmail(email);
    if (existing !== null) {
      return res.status(409).json({ msg: "Ese correo ya está registrado", data: null });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newId = await createUser(name, email, hashedPassword);

    return res.status(201).json({
      msg: "Usuario registrado",
      data: { id: newId, name: name, email: email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error interno del servidor", data: null });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Correo y contraseña son obligatorios", data: null });
    }

    const user = await getUserByEmail(email);
    if (user === null) {
      return res.status(401).json({ msg: "Correo o contraseña incorrectos", data: null });
    }

    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk) {
      return res.status(401).json({ msg: "Correo o contraseña incorrectos", data: null });
    }

    return res.status(200).json({
      msg: "Inicio de sesión correcto",
      data: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error interno del servidor", data: null });
  }
}