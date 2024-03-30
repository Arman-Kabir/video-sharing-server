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
        const user = await User.findOne({ name: req.body.name });
        if (!user) return next(createError(404, "user not found"));

        const isCorrect = await bcrypt.compare(req.body.password, user.password);

        if (!isCorrect) return next(createError(400, "Wrong credentials"));

        const token = jwt.sign({ id: user._id }, process.env.JWT);

        const { password, ...others } = user._doc;

        res.cookie("access_token", token, {
            httpOnly: true,
            // secure: true
        }).status(200).json(others)

    } catch (err) {
        // todo
        next(err);
    }
}

export const googleAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        console.log('first user' + user);

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT);
            res.cookie("access_token", token, {
                httpOnly: true,
                // secure: true
            }).status(200).json(user._doc);
        }
        if (!user) {
            const newUser = new User({
                ...req.body,
                fromGoogle: true
            })
            const savedUser = await newUser.save();
            console.log('savedUYser' + savedUser);

            const token = jwt.sign({ id: savedUser._id }, process.env.JWT);

            res.cookie("access_token", token, {
                httpOnly: true,
                // secure: true
            }).status(200).json(savedUser._doc)
        }

    } catch (error) {
        next(error)
    }
}