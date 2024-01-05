import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
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
};

export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({name:req.body.name});
        if(!user) return next(createError(404,"user not found"));

        const isCorrect = await bcrypt.compare(req.body.password,user.password);

        if(!isCorrect) return next(createError(400,"Wrong credentials"));

        const token = jwt.sign({id:user._id},process.env.JWT);

        const {} = user;

        res.cookie("access_token",token,{
            httpOnly:true
        }).status(200).json(user)



    } catch (err) {
        // todo
        next(err);
    }
}