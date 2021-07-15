import express from 'express';
import mongoose from 'mongoose';
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();
        res.status(200).json(postMessages);
    } catch (e) {
        res.status(404).json({message: e.message});
    }
};

export const createPosts = async (req, res) => {
    try {
        const post = req.body;

        const newPost = new PostMessage(post);

        await newPost.save();
        res.status(201).json(newPost);

    } catch (e) {
        res.status(409).json({message: e.message});
    }
};

export const updatePost = async (req, res) => {
    try {
        const {id: _id} = req.params;
        const post = req.body;
        if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(406).send('No post with that id');
        const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, {new: true});

        res.json(updatedPost);
    } catch (e) {

    }
};

export const deletePost = async (req, res) => {
    try {
        const {id: _id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(406).send('No post with that id');

        await PostMessage.findByIdAndRemove(_id);

        res.json({message: "Post deleted successfully"});
    } catch (e) {
        console.log(e.message)
    }
};
