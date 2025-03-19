const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String },
    image: { type: String, required: true }, // Store image URL
    intro: { type: String, required: true },
    para1: { type: String },
para2: { type: String },
para3: { type: String },
para4: { type: String },
para5: { type: String },
para6: { type: String },
para7: { type: String },
para8: { type: String },
para9: { type: String },
para10: { type: String },
para11: { type: String },
para12: { type: String },
para13: { type: String },
para14: { type: String },
para15: { type: String },
para16: { type: String },
para17: { type: String },
para18: { type: String },
para19: { type: String },
para20: { type: String },
    comments: [
        {
            name: { type: String, required: true },
            email: { type: String, required: true },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', BlogSchema);