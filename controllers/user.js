import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from "../models/user.js";
import dotenv from 'dotenv';

export const signin = async (req, res) => {
    try {
        const {email, password} = req.body;
        const existingUser = await User.findOne({email});

        if(!existingUser) return res.status(404).json({message:"User doesn't exist."});

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(400).json({message:"Invaid credentials"});

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1h"});

        res.status(200).json({result: existingUser, token});

    } catch (e) {
        console.log(e);
        res.status(500).json({message: "Something went wrong"});
    }
};

export const signup = async (req, res) => {
    try {
        const {email, password, confirmPassword, firstName, lastName} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(404).json({message:"User already exist."});

        if (password !== confirmPassword) return res.status(404).json({message:"Passwords don't match."});

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({email, password: hashedPassword, name: `${firstName} ${lastName}`});
        const token = jwt.sign({email: result.email, id: result._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1h"});

        res.status(200).json({result, token});

    } catch (e) {
        console.log(e)
    }
};
