require('dotenv').config();  
const connectDB = require('../db');  
const Product = require('./Product');  

const seedProducts = async () => {
    await connectDB();

    const products = [
        {
            name: 'CeraVE Moisturizing Cream',
            description: 'A moisturizing cream that helps restore the protective skin barrier.',
            price: 10.00,
            imageUrl: '/pics/BePanthen.jpg',
            featured: true,
            category: 'Skin care'
        },
        {
            name: 'La Roche-Posay Effaclar Duo',
            description: 'Dual action acne treatment reduces the number and severity of acne blemishes.',
            price: 20.00,
            imageUrl: '/pics/BioDerma_atopicream.jpg',
            featured: true,
            category: 'Skin care'
        },
        {
            name: 'Eucerin Hyaluron-Filler',
            description: 'Anti-wrinkle cream with Hyaluronic Acid, Saponin, and Enoxolone.',
            price: 30.00,
            imageUrl: '/pics/Eucerin_aquaphor.jpg',
            featured: true,
            category: 'Skin care'
        },
        {
            name: 'Avene XeraCalm A.D',
            description: 'Lipifill and moisturizing balm for dry to very dry skin.',
            price: 25.00,
            imageUrl: '/pics/Eucerin-oil-50spf.jpg',
            featured: true,
            category: 'Skin care'
        },
        {
            name: 'Avene different  A.D',
            description: 'bad for your skin.',
            price: 125.00,
            imageUrl: '/pics/CellFrame_n.jpg',
            featured: true,
            category: 'Skin care'
        },
        {
            name: 'Cetaphil Gentle Skin Cleanser',
            description: 'Soothes and softens as it cleanses, suitable for sensitive skin.',
            price: 15.00,
            imageUrl: '/pics/mecobalamin.jpg',
            featured: true,
            category: 'Antibiotics'
        },
        {
            name: 'Neutrogena Hydro Boost Water Gel',
            description: 'Water gel moisturizer that helps hydrate and smooth skin.',
            price: 22.00,
            imageUrl: '/pics/CellFrame_n.jpg',
            featured: true,
            category: 'Antibiotics'
        },
        {
            name: 'Bioderma Sensibio H2O',
            description: 'Micellar water that cleanses and removes makeup.',
            price: 18.00,
            imageUrl: '/pics/CellFrame_n.jpg',
            featured: true,
            category: 'Antibiotics'
        },
        {
            name: 'Olay Regenerist Micro-Sculpting Cream',
            description: 'Anti-aging moisturizer that firms skin and reduces wrinkles.',
            price: 35.00,
            imageUrl: '/pics/mecobalamin.jpg',
            featured: true,
            category: 'Antibiotics'
        },
        {
            name: 'Vichy Mineral 89',
            description: 'Hydrating booster with hyaluronic acid for daily skin health.',
            price: 28.00,
            imageUrl: '/pics/CellFrame_n.jpg',
            featured: true,
            category: 'Babycare'
        },
        {
            name: 'The Ordinary Niacinamide 10% + Zinc 1%',
            description: 'Serum that helps to reduce the appearance of blemishes and congestion.',
            price: 12.00,
            imageUrl: '/pics/CellFrame_n.jpg',
            featured: true,
            category: 'Babycare'
        }
    ];

    try {
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log('Products seeded...');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedProducts();
