import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from "bcryptjs";
import { createError } from '../error.js';

export const signup = async (req, res, next) => {
    try {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        // console.log(req.body);
        const newUser = new User({ ...req.body, password: hash });
        // console.log(newUser);

        await newUser.save();
        res.status(200).send("User has been created");
    } catch (err) {
        // todo
        next(err);
    }
}