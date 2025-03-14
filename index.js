const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const MongoStore = require('connect-mongo')
const session = require('express-session')

const authRoutes = require("./routes/auth")
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const categoryRoutes =require('./routes/categoryRoutes');
const blogRoutes =require('./routes/blogRoute');
const commentRoutes =require('./routes/commentRoute');








const connectDB = require("./config/database")


// variables
const PORT = process.env.PORT || 3060;  // Use the port assigned by Render or default to 3000
const DBURL = "mongodb+srv://fooddeck3:majoje1582@cluster0.smhy0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// Connect to MongoDB
connectDB()


// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  
  store: MongoStore.create({ mongoUrl: DBURL })
}));
app.use(methodOverride('_method'))


// 
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use('/api/orders', orderRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);


// Root route
app.get('/', (req, res) => {
  res.send('Server started running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
