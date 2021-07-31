import mongoose from 'mongoose';
import PostMessage from "../models/postMessage.js";

export const getPost = async (req, res) => {
    try {
        const {id} = req.params;

        const post = await PostMessage.findById(id);

        res.status(200).json(post);
    } catch (e) {
        res.status(404).json({message: e.message});
    }
};

export const getPosts = async (req, res) => {
    try {
        const {page} = req.query;
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await PostMessage.countDocuments({});

        const posts = await PostMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex);

        res.status(200).json({data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (e) {
        res.status(404).json({message: e.message});
    }
};

export const getPostsBySearch = async(req, res) => {
    try {
        const {searchQuery, tags} = req.query;

        const title = new RegExp(searchQuery, 'i');

        const posts = await PostMessage.find({$or: [{title}, {tags:{$in: tags.split(',')}}] });

        res.json({data: posts})
    }catch (e) {
        res.status(404).json({message: e.message});
    }
};

export const createPosts = async (req, res) => {
    try {
        const post = req.body;

        const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString()});

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

export const likePost = async (req, res) => {
    try {
        const {id: _id} = req.params;

        if (!req.userId) return res.json({message:"Unauthenticated"});

        if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(406).send('No post with that id');

        const post = await PostMessage.findById(_id);
        const index = post.likes.findIndex((id) => id === String(req.userId));

        if (index === -1) {
            //like post
            post.likes.push(req.userId)
        } else {
            //dislike post
            post.likes = post.likes.filter((id) => id !== String(req.userId))
        }

        const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {new: true});

        res.json(updatedPost);
    } catch (e) {
        console.log(e.message)
    }
};

export const commentPost = async (req, res) => {
    try {
        const {id} = req.params;
        const {value} = req.body;

        const post = await PostMessage.findById(id);

        post.comments.push(value);

        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true});
        res.json(updatedPost)
    } catch (e) {
        console.log(e.message);
    }
};
