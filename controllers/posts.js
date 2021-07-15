import express from 'express';
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();
        res.status(200).json(postMessages);
    } catch (e) {
        res.status(404).json({message: e.message})
    }
};

export const createPosts = (req, res) => {
    try {

    } catch (e) {

    }
    res.send('Post created!')
};
