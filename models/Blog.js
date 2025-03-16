coconst mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String },
    image: { type: String, required: true }, // Store image URL
    intro: { type: String, required: true },
    para1: { type: String, required: true },
    para2: { type: String, required: true },
    para3: { type: String, required: true },
    para4: { type: String, required: true },
    para5: { type: String, required: true },
    para6: { type: String, required: true },
    para7: { type: String, required: true },
    para8: { type: String, required: true },
    para9: { type: String, required: true },
    para10: { type: String, required: true },
    para11: { type: String, required: true },
    para12: { type: String, required: true },
    para13: { type: String, required: true },
    para14: { type: String, required: true },
    para15: { type: String, required: true },
    para16: { type: String, required: true },
    para17: { type: String, required: true },
    para18: { type: String, required: true },
    para19: { type: String, required: true },
    para20: { type: String, required: true },
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