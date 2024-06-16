require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./db');
const Product = require('./models/Product');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/User');
const Cart = require('./models/Cart'); 
const bcrypt = require('bcryptjs');
const app = express();

// Connect to db
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware 
app.use(session({
    secret: '9I6h7wDPE6J3/f1J6yV7r9g==R+Z+B2dJ2a0eHj4tK3M',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
        ttl: 100 * 24 * 60 * 60 // 100 days made to seconds
    }),
    cookie: {
        maxAge: 100 * 24 * 60 * 60 * 1000 // 100 days made to  milliseconds
    }
}));

//  static files from the public
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Pharmacy.html'));
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'products.html'));
});

app.get('/productspage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'productspage.html'));
});

app.get('/skincare', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'skincare.html'));
});

app.get('/antibiotics', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'antibiotics.html'));
});

app.get('/babycare', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'babycare.html'));
});

//  route to get featured products by category 
app.get('/api/featured-products', async (req, res) => {
    try {
        const { category } = req.query;
        const query = { featured: true };
        if (category) {
            query.category = category;
        }
        const featuredProducts = await Product.find(query);
        res.json(featuredProducts);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

//  route to get product detailes using the product id to sort
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//  route to get products by category
app.get('/api/products', async (req, res) => {
    try {
        const { category } = req.query;
        const query = {};
        if (category) {
            query.category = category;
        }
        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({
            name,
            email,
            password
        });
        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log(`Login attempt for email: ${email}`);
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        console.log('User found, checking password...');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        console.log('Password matches');
        req.session.user = {
            id: user.id,
            username: user.name
        };
        res.json({ msg: 'Logged in successfully', redirect: '/dashboard.html' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    } else {
        res.redirect('/login.html');
    }
});

app.get('/api/user', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ msg: 'Unauthorized' });
    }
});

app.post('/api/cart', async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.session.user.id;
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }

        cart.products.push(productId);
        await cart.save();

        res.status(201).json({ msg: 'Product added to cart' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/cart', async (req, res) => {
    try {
        const userId = req.session.user.id;
        const cart = await Cart.findOne({ user: userId }).populate('products');

        if (!cart) {
            return res.status(200).json([]);
        }

        res.json(cart.products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.delete('/api/cart/:productId', async (req, res) => {
    try {
        const userId = req.session.user.id;
        const productId = req.params.productId;
        
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(400).json({ msg: 'Cart not found' });
        }

        cart.products = cart.products.filter(id => id.toString() !== productId);
        await cart.save();

        res.json({ msg: 'Product removed from cart' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ msg: 'No search query provided' });
        }
        const searchResults = await Product.find({
            name: { $regex: query, $options: 'i' } 
        }).limit(10); 
        res.json(searchResults);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// Port Number
const PORT = process.env.PORT || 5000;

// Server 
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
