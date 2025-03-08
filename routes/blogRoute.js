const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// GET: Fetch all blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching blogs' });
    }
});

// POST: Create new blog
router.post('/', async (req, res) => {
    const { title, image, content, author } = req.body;

    if (!title || !image || !content) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const blog = await Blog.create({ title, image, content, author });
        res.json({ success: true, message: 'Blog created successfully', blog });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating blog' });
    }
});
// GET: Fetch a single blog
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.json({ success: true, blog });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching blog' });
    }
});
// PUT: Update a blog
router.put('/update/:id', async (req, res) => {
    const { title, image, content } = req.body;

    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, { title, image, content }, { new: true });
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.json({ success: true, message: 'Blog updated successfully', blog });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating blog' });
    }
});

// DELETE: Remove a blog
router.delete('/delete/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.json({ success: true, message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting blog' });
    }
});

module.exports = router;
