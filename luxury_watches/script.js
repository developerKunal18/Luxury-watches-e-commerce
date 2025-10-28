// Product Data
const products = [
    {
        id: 1,
        name: "Submariner Date",
        brand: "Rolex",
        price: 8500,
        image: "https://cdn2.ethoswatches.com/rolex/pub/media/newtheme/desktop/rolex-submariner-m126613lb-0002_2206es_001_xl-landscape.jpeg",
        category: "rolex",
        description: "Iconic diving watch with date function"
    },
    {
        id: 2,
        name: "Daytona",
        brand: "Rolex",
        price: 13500,
        image: "https://monochrome-watches.com/wp-content/uploads/2021/05/Rolex-Daytona-116500LN-Market-analysis-continuous-and-insane-rise-price-4.jpg",
        category: "rolex",
        description: "Professional racing chronograph"
    },
    {
        id: 3,
        name: "GMT-Master II",
        brand: "Rolex",
        price: 9500,
        image: "https://cdn2.ethoswatches.com/rolex/pub/media/newtheme/desktop/rolex-gmt-master-mid-full-landscape.jpg",
        category: "rolex",
        description: "Dual timezone travel watch"
    },
    {
        id: 4,
        name: "Datejust 41",
        brand: "Rolex",
        price: 9200,
        image: "https://rubberb.com/blog/wp-content/uploads/2020/04/Rolex-Datejust-41-ref-126334-Steel-4.jpg",
        category: "rolex",
        description: "Classic elegance with date display"
    },
    {
        id: 5,
        name: "Day-Date 40",
        brand: "Rolex",
        price: 38000,
        image: "https://media.rolex.com/image/upload/q_auto:best/f_auto/c_limit,w_3840/v1708407014/rolexcom/collection/family-pages/classic-watches/day-date/navigation/classic-watches-day-date-navigation-all-models-m228239-0033",
        category: "rolex",
        description: "The President's watch in 18k gold"
    },
    {
        id: 6,
        name: "Speedmaster Professional",
        brand: "Omega",
        price: 6200,
        image: "https://www.prestigetime.com/blog/images/Omega-Speedmaster-Moonwatch-Apollo-11-50th-Anniversary-Review.jpg",
        category: "omega",
        description: "The Moonwatch - NASA's choice for space missions"
    },
    {
        id: 7,
        name: "Seamaster 300M",
        brand: "Omega",
        price: 5200,
        image: "https://www.watchdavid.com/wp-content/uploads/2021/11/Omega-Seamaster-Professional-Diver-300M-01.jpg",
        category: "omega",
        description: "Professional diving watch with 300m water resistance"
    },
    {
        id: 8,
        name: "Constellation",
        brand: "Omega",
        price: 4800,
        image: "https://cdn1.ethoswatches.com/media/catalog/product/cache/6e5de5bc3d185d8179cdc7258143f41a/o/m/omega-constellation-131-10-28-60-05-001-multiple-6.jpg",
        category: "omega",
        description: "Elegant dress watch with star design"
    },
    {
        id: 9,
        name: "De Ville Prestige",
        brand: "Omega",
        price: 3500,
        image: "https://robbreport.com/wp-content/uploads/2020/12/OMEGA_424.13.40.21.03.003_amb.gif",
        category: "omega",
        description: "Sophisticated automatic dress watch"
    },
    {
        id: 10,
        name: "Nautilus 5711",
        brand: "Patek Philippe",
        price: 35000,
        image: "https://precisionwatches.com/wp-content/uploads/2023/10/Patek-Philippe-For-Sale-Pre-Owned-683x1024.jpg",
        category: "patek",
        description: "Ultra-thin automatic sports watch"
    },
    {
        id: 11,
        name: "Calatrava 5196",
        brand: "Patek Philippe",
        price: 28000,
        image: "https://img.everywatch.com/media/2025/03/29/patek-philippe-calatrava-5196g39526026.webp",
        category: "patek",
        description: "Classic dress watch with manual winding"
    },
    {
        id: 12,
        name: "Grand Complications",
        brand: "Patek Philippe",
        price: 85000,
        image: "https://luxurytimenyc.com/cdn/shop/collections/grand-complications-945679.jpg?v=1593414823",
        category: "patek",
        description: "Perpetual calendar with moon phase"
    },
    {
        id: 13,
        name: "Aquanaut",
        brand: "Patek Philippe",
        price: 22000,
        image: "https://blog.crownandcaliber.com/wp-content/uploads/2019/12/Patek-Philippe-Aquanaut-0701-1.jpg",
        category: "patek",
        description: "Modern sports watch with rubber strap"
    },
    {
        id: 14,
        name: "Royal Oak",
        brand: "Audemars Piguet",
        price: 22000,
        image: "https://media.gq.com/photos/5cb8d67190e0bd653a0f54ab/16:9/w_2000,h_1125,c_limit/What-is-a-Royal-Oak-GQ-04182019_3x2.jpg",
        category: "audemars",
        description: "Revolutionary luxury sports watch"
    },
    {
        id: 15,
        name: "Royal Oak Offshore",
        brand: "Audemars Piguet",
        price: 28000,
        image: "https://monochrome-watches.com/wp-content/uploads/2017/11/Audemars-Piguet-Royal-Oak-Offshore-Chronograph-Reedition-25th-Anniversary-26237ST-10.jpg",
        category: "audemars",
        description: "Sporty chronograph with bold design"
    },
    {
        id: 16,
        name: "Millenary",
        brand: "Audemars Piguet",
        price: 18000,
        image: "https://images.watchcollecting.com/058949/240129-Watch-Collecting-001.jpeg?fit=crop&crop=bottom&auto=compress&dpr=1&cs=srgb",
        category: "audemars",
        description: "Unique oval case with exposed movement"
    },
    {
        id: 17,
        name: "Jules Audemars",
        brand: "Audemars Piguet",
        price: 25000,
        image: "https://mrwatchley.com/cdn/shop/products/MrWatchley-S64-29_800x.jpg?v=1643104054",
        category: "audemars",
        description: "Classic round case with complications"
    },
    {
        id: 18,
        name: "Tank",
        brand: "Cartier",
        price: 2800,
        image: "https://blog.europeanwatch.com/blog/wp-content/uploads/2022/09/HERO-Cartier-Privee-Collection-Tank-Chinoise-WGTA0074-scaled.jpg",
        category: "cartier",
        description: "Iconic rectangular design"
    },
    {
        id: 19,
        name: "Ballon Bleu",
        brand: "Cartier",
        price: 5200,
        image: "https://monochrome-watches.com/wp-content/uploads/2021/04/Ballon_Blue_de_Cartier-3650.jpg",
        category: "cartier",
        description: "Elegant round case with blue cabochon"
    },
    {
        id: 20,
        name: "Santos",
        brand: "Cartier",
        price: 6800,
        image: "https://images.squarespace-cdn.com/content/v1/512f9596e4b0ed945e3306aa/2bb9ecd4-4d23-4b4b-b041-b5cade7fe93d/P1022420.jpg",
        category: "cartier",
        description: "Aviation-inspired square case"
    },
    {
        id: 21,
        name: "Panthère",
        brand: "Cartier",
        price: 4200,
        image: "https://www.cortinawatch.com/my/wp-content/uploads/sites/2/2025/02/Cartier-Collection-Page-Panth-re-de-Cartier.webp",
        category: "cartier",
        description: "Feminine elegance with link bracelet"
    },
    {
        id: 22,
        name: "Pilot's Watch",
        brand: "IWC",
        price: 5800,
        image: "https://cdn1.ethoswatches.com/media/catalog/product/cache/6e5de5bc3d185d8179cdc7258143f41a/i/w/iwc-pilots-iw388104-multiple-7.jpg",
        category: "iwc",
        description: "Professional aviation timepiece"
    },
    {
        id: 23,
        name: "Portuguese",
        brand: "IWC",
        price: 12000,
        image: "https://cdn4.ethoswatches.com/the-watch-guide/wp-content/uploads/2015/06/IWC-411.jpg",
        category: "iwc",
        description: "Maritime heritage with chronograph"
    },
    {
        id: 24,
        name: "Aquatimer",
        brand: "IWC",
        price: 8500,
        image: "https://cdn.shopify.com/s/files/1/0609/1636/7523/files/iw379406-front-mood.jpg?v=1703079939",
        category: "iwc",
        description: "Professional diving watch"
    },
    {
        id: 25,
        name: "Ingenieur",
        brand: "IWC",
        price: 7200,
        image: "https://swisswatches-magazine.com/uploads/2024/12/iwc-ingenieur-automatic-40-iw328902-frontal-3.webp",
        category: "iwc",
        description: "Engineering precision with magnetic protection"
    },
    {
        id: 26,
        name: "Reverso",
        brand: "Jaeger-LeCoultre",
        price: 8500,
        image: "https://www.thejewelleryeditor.com/media/images_thumbnails/filer_public_thumbnails/filer_public/cc/48/cc48149a-3a5a-405e-905f-d286a729b35d/jaeger-lecoultre-grande-reverso-ut-special-london-flagship-edition-front_books.jpg__1536x0_q75_crop-scale_subsampling-2_upscale-false.jpg",
        category: "jaeger",
        description: "Reversible case for polo protection"
    },
    {
        id: 27,
        name: "Master Control",
        brand: "Jaeger-LeCoultre",
        price: 6800,
        image: "https://cdn1.ethoswatches.com/media/catalog/product/cache/6e5de5bc3d185d8179cdc7258143f41a/j/a/jaeger-lecoultre-master-control-q413257j-multiple-2.jpg",
        category: "jaeger",
        description: "Classic round case with date"
    },
    {
        id: 28,
        name: "Polaris",
        brand: "Jaeger-LeCoultre",
        price: 9200,
        image: "https://cdn1.ethoswatches.com/media/catalog/product/cache/6e5de5bc3d185d8179cdc7258143f41a/j/a/jaeger-lecoultre-polaris-q9088180-multiple-2.jpg",
        category: "jaeger",
        description: "Sporty elegance with inner bezel"
    },
    {
        id: 29,
        name: "Atmos",
        brand: "Jaeger-LeCoultre",
        price: 15000,
        image: "https://img.jaeger-lecoultre.com/fifty-fifty-standard-1/80357bfe5c4be9baa4954055e52a8c4267016591.jpg",
        category: "jaeger",
        description: "Perpetual motion clock"
    },
    {
        id: 30,
        name: "Overseas",
        brand: "Vacheron Constantin",
        price: 22000,
        image: "https://monochrome-watches.com/app/uploads/2022/10/Vacheron-Constantin-Overseas-Chronograph-5500V-pink-gold-blue-dial-2.jpg",
        category: "vacheron",
        description: "Luxury sports watch with quick strap change"
    },
    {
        id: 31,
        name: "Fiftysix",
        brand: "Vacheron Constantin",
        price: 18000,
        image: "https://hodinkee.imgix.net/uploads/images/825e8ea3-2974-4a78-91ee-f217bde33dc3/Vacheron-constantin-fiftysix-hero.jpg?ixlib=rails-1.1.0&fm=jpg&q=55&auto=format&usm=12",
        category: "vacheron",
        description: "Contemporary classic design"
    },
    {
        id: 32,
        name: "Traditionnelle",
        brand: "Vacheron Constantin",
        price: 35000,
        image: "https://cdn.prod.website-files.com/63b937f7cb69a848fab5e097/64293a7422da78d0898025d3_Lead%20image%20VC.png",
        category: "vacheron",
        description: "Traditional haute horlogerie"
    },
    {
        id: 33,
        name: "Classique",
        brand: "Breguet",
        price: 28000,
        image: "https://www.breguet.com/sites/default/files/2024-03/slider-classique-3.png?im=Resize,width=800",
        category: "breguet",
        description: "Elegant dress watch with guilloché dial"
    },
    {
        id: 34,
        name: "Marine",
        brand: "Breguet",
        price: 22000,
        image: "https://images.secondmovement.com/media/catalog/product/cache/105b3c9229095e8c1e373d2e9464b4da/b/r/breguet-marine-5847br-z2-5zv-powg17a-multiple-1.jpg",
        category: "breguet",
        description: "Maritime heritage with wave pattern"
    },
    {
        id: 35,
        name: "Heritage",
        brand: "Breguet",
        price: 45000,
        image: "https://img.chrono24.com/images/uhren/38721682-jnjushfv4tj1hw3o5hago1sw-ExtraLarge.jpg",
        category: "breguet",
        description: "Tourbillon with retrograde seconds"
    },
    {
        id: 36,
        name: "Lange 1",
        brand: "A. Lange & Söhne",
        price: 42000,
        image: "https://swisswatches-magazine.com/uploads/2021/04/A-Lange-Soehne-Lange1-Perpetual-Calendar-345-056-Salmon-dial.jpg",
        category: "lange",
        description: "Asymmetrical dial with outsize date"
    },
    {
        id: 37,
        name: "Saxonia",
        brand: "A. Lange & Söhne",
        price: 28000,
        image: "https://blog.europeanwatch.com/blog/wp-content/uploads/2022/02/HERO-A-Lange-_-Sohne-Saxonia-Thin-Manual-Wind-Blue-Gold-Flux-Dial-205.086-scaled.jpg",
        category: "lange",
        description: "Minimalist design with manual winding"
    },
    {
        id: 38,
        name: "Datograph",
        brand: "A. Lange & Söhne",
        price: 85000,
        image: "https://wornandwound.com/library/uploads/2024/04/LANGE_LUMEN_10.jpg",
        category: "lange",
        description: "Flyback chronograph with outsize date"
    },
    {
        id: 39,
        name: "Zeitwerk",
        brand: "A. Lange & Söhne",
        price: 95000,
        image: "https://revolutionwatch.com/wp-content/uploads/2023/04/ALS_142_031_F_Zeitwerk_2022_2388671-scaled-1.jpg",
        category: "lange",
        description: "Digital time display with mechanical movement"
    },
    {
        id: 40,
        name: "Edge",
        brand: "Titan",
        price: 180,
        image: "https://www.titan.co.in/on/demandware.static/-/Sites-titan-master-catalog/default/dw8f98738f/images/Titan/Catalog/1595NL04_1.jpg",
        category: "titan",
        description: "Contemporary design with premium finish"
    },
    {
        id: 41,
        name: "Raga",
        brand: "Titan",
        price: 120,
        image: "https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dwcc3fa2a0/images/Titan/Catalog/95282KM01_1.jpg?sw=600&sh=600",
        category: "titan",
        description: "Elegant women's watch with floral motifs"
    },
    {
        id: 42,
        name: "Octane",
        brand: "Titan",
        price: 250,
        image: "https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dwc34b14c0/images/Titan/Catalog/90086KM02J_1.jpg?sw=600&sh=600",
        category: "titan",
        description: "Sporty chronograph with bold styling"
    },
    {
        id: 43,
        name: "Karishma",
        brand: "Titan",
        price: 95,
        image: "https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw19cfacee/images/Titan/Catalog/1825SM11_2.jpg?sw=600&sh=600",
        category: "titan",
        description: "Feminine elegance with crystal accents"
    },
    {
        id: 44,
        name: "Nebula",
        brand: "Titan",
        price: 320,
        image: "https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw02166c5c/images/Titan/Catalog/5078DL03_1.jpg?sw=800&sh=800",
        category: "titan",
        description: "Premium automatic with exhibition caseback"
    },
    {
        id: 45,
        name: "Classic",
        brand: "Logus",
        price: 85,
        image: "https://m.media-amazon.com/images/I/71QGZlg2B3L.jpg",
        category: "logus",
        description: "Timeless design with leather strap"
    },
    {
        id: 46,
        name: "Sport",
        brand: "Logus",
        price: 110,
        image: "https://m.media-amazon.com/images/I/71GyH0xzNxL._UY1000_.jpg",
        category: "logus",
        description: "Water-resistant sports watch"
    },
    {
        id: 47,
        name: "Elegance",
        brand: "Logus",
        price: 75,
        image: "https://assets.myntassets.com/w_412,q_60,dpr_2,fl_progressive/assets/images/2024/AUGUST/17/FS8E7aRd_25d341a6cef445b9a00bab538927f13e.jpg",
        category: "logus",
        description: "Sophisticated dress watch"
    },
    {
        id: 48,
        name: "Chronograph",
        brand: "Logus",
        price: 140,
        image: "https://cdn.prod.website-files.com/669a292e74131814a3938551/66acbe6efae3bdc4f7c1fd07_G%201973%20YL-10.jpg",
        category: "logus",
        description: "Precision timing with stopwatch function"
    },
    {
        id: 49,
        name: "Diamond",
        brand: "Logus",
        price: 180,
        image: "https://m.media-amazon.com/images/I/71W5Vp50mHL._SL1500_.jpg",
        category: "logus",
        description: "Luxury watch with diamond accents"
    },
    {
        id: 50,
        name: "G-Timeless",
        brand: "Gucci",
        price: 1200,
        image: "https://media.gucci.com/style/HEXFBFBFB_South_0_160_640x640/1750923911/826854_I1600_8512_001_100_0000_Light.jpg",
        category: "gucci",
        description: "Iconic bee motif with leather strap"
    },
    {
        id: 51,
        name: "Grip",
        brand: "Gucci",
        price: 950,
        image: "https://highonkicks.com/cdn/shop/files/3J0A1872_jpg.webp?v=1729762963",
        category: "gucci",
        description: "Modern design with interchangeable straps"
    },
    {
        id: 52,
        name: "Le Marché des Merveilles",
        brand: "Gucci",
        price: 1800,
        image: "https://cdn.i-scmp.com/sites/default/files/styles/1020x680/public/images/methode/2018/08/15/c3f1f060-9c40-11e8-9a20-262028f49e8a_image_hires_112933.jpg?itok=7yJ08-2e&v=1534303763",
        category: "gucci",
        description: "Luxury collection with animal motifs"
    },
    {
        id: 53,
        name: "Dive",
        brand: "Gucci",
        price: 2200,
        image: "https://img.chrono24.com/images/uhren/35151375-hfnucmvqt70cyttwwv5k4m0w-ExtraLarge.jpg",
        category: "gucci",
        description: "Professional diving watch with Gucci styling"
    },
    {
        id: 54,
        name: "Chronograph",
        brand: "Gucci",
        price: 1500,
        image: "https://cdn.itshot.com/product/i/c/iced-out-gucci-chrono-diamond-watch-2ct-p-42327.jpg?w=1",
        category: "gucci",
        description: "Sporty chronograph with signature branding"
    },
    {
        id: 55,
        name: "Bamboo",
        brand: "Gucci",
        price: 2800,
        image: "https://a.1stdibscdn.com/vintage-gucci-bangle-6800l-watch-gucci-ladies-bangle-gold-tone-bamboo-wristwatch-for-sale/j_41232/j_254650421739853100119/j_25465042_1739853101143_bg_processed.jpg?disable=upscale&auto=webp&quality=60&width=640",
        category: "gucci",
        description: "Exclusive bamboo case design"
    }
];

// Shopping Cart
let cart = [];

// Authentication State
let currentUser = null;
let authToken = null;
const API_BASE_URL = 'http://localhost:5000/api';

// Activity Tracking State
let sessionStartTime = Date.now();
let pageViewTracked = false;

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const filterBtns = document.querySelectorAll('.filter-btn');
const navMenu = document.querySelector('.nav-menu');
const menuToggle = document.querySelector('.menu-toggle');
const contactForm = document.getElementById('contactForm');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
    setupEventListeners();
    loadCartFromStorage();
    updateCartDisplay();
    initializeAuth();
    checkAuthStatus();
    initializeActivityTracking();
});

// Save products array to localStorage for product.html to use
localStorage.setItem('luxuryWatchesProducts', JSON.stringify(products));

// Setup Event Listeners
function setupEventListeners() {
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterProducts(filter);
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', toggleMenu);

    // Contact form
    contactForm.addEventListener('submit', handleContactForm);

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Close cart when clicking outside
    cartOverlay.addEventListener('click', function(e) {
        if (e.target === cartOverlay) {
            toggleCart();
        }
    });
}

// Display Products
function displayProducts(productsToShow) {
    productsGrid.innerHTML = '';
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '<div class="no-products"><h3>No products found</h3><p>Try adjusting your filters</p></div>';
        return;
    }

    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <div class="product-brand">${product.brand}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">$${product.price.toLocaleString()}</div>
            <p class="product-description">${product.description}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `;
    return card;
}

// Filter Products
function filterProducts(category) {
    let filteredProducts;
    if (category === 'all') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    displayProducts(filteredProducts);
}

// Shopping Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    // Track add to cart activity
    trackAddToCart(productId, product.name, product.price);

    updateCartDisplay();
    saveCartToStorage();
    showNotification('Product added to cart!');
}

function removeFromCart(productId) {
    const product = products.find(p => p.id === productId);
    cart = cart.filter(item => item.id !== productId);
    
    // Track remove from cart activity
    if (product) {
        trackRemoveFromCart(productId, product.name);
    }
    
    updateCartDisplay();
    saveCartToStorage();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
            saveCartToStorage();
        }
    }
}

function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toLocaleString()}`;
}

// Cart Storage
function saveCartToStorage() {
    localStorage.setItem('luxuryWatchesCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('luxuryWatchesCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// UI Functions
function toggleCart() {
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartOverlay.classList.contains('active') ? 'hidden' : 'auto';
    
    // Track cart view when opening
    if (cartOverlay.classList.contains('active')) {
        trackCartView();
    }
}

function toggleMenu() {
    navMenu.classList.toggle('active');
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #d4af37;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Contact Form Handler
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const message = e.target.querySelector('textarea').value;

    // Track contact form submission
    trackContactFormSubmit({ name, email, message });

    // Simulate form submission
    showNotification('Thank you for your message! We\'ll get back to you soon.');
    e.target.reset();
}

// Checkout Function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Track checkout start
    trackCheckoutStart();
    
    // Simulate checkout process
    showNotification('Redirecting to checkout...');
    
    // In a real application, this would redirect to a payment processor
    setTimeout(() => {
        alert(`Checkout Total: $${total.toLocaleString()}\n\nThis is a demo. In a real application, you would be redirected to a secure payment page.`);
        
        // Clear cart after successful checkout
        cart = [];
        updateCartDisplay();
        saveCartToStorage();
        toggleCart();
    }, 2000);
}

// Search Functionality
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    displayProducts(filteredProducts);
}

// Add search functionality to the page
function addSearchBar() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" id="searchInput" placeholder="Search watches..." class="search-input">
        <button onclick="performSearch()" class="search-btn">
            <i class="fas fa-search"></i>
        </button>
    `;
    
    // Insert search bar after the filters
    const filters = document.querySelector('.filters');
    filters.parentNode.insertBefore(searchContainer, filters.nextSibling);
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query === '') {
        displayProducts(products);
        return;
    }
    
    searchProducts(query);
}

// Add search bar when page loads
document.addEventListener('DOMContentLoaded', function() {
    addSearchBar();
});

// Add some CSS for the search functionality
const searchStyles = `
    .search-container {
        display: flex;
        justify-content: center;
        margin-bottom: 2rem;
        gap: 1rem;
    }
    
    .search-input {
        padding: 0.8rem 1.5rem;
        border: 2px solid #e9ecef;
        border-radius: 25px;
        font-size: 1rem;
        width: 300px;
        transition: border-color 0.3s ease;
    }
    
    .search-input:focus {
        outline: none;
        border-color: #d4af37;
    }
    
    .search-btn {
        background: #d4af37;
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .search-btn:hover {
        background: #b8941f;
        transform: translateY(-2px);
    }
    
    .empty-cart {
        text-align: center;
        color: #666;
        font-style: italic;
    }
    
    .no-products {
        text-align: center;
        grid-column: 1 / -1;
        padding: 3rem;
    }
    
    .no-products h3 {
        color: #1a1a1a;
        margin-bottom: 1rem;
    }
    
    .no-products p {
        color: #666;
    }
`;

// Inject search styles
const styleSheet = document.createElement('style');
styleSheet.textContent = searchStyles;
document.head.appendChild(styleSheet);

// Add keyboard shortcut for search
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// ==================== AUTHENTICATION FUNCTIONS ====================

// Initialize Authentication
function initializeAuth() {
    // Load saved authentication state
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = JSON.parse(savedUser);
    }
    
    // Setup authentication form event listeners
    setupAuthEventListeners();
}

// Setup Authentication Event Listeners
function setupAuthEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Forgot password form
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }
    
    // Close modals when clicking outside
    const authOverlay = document.getElementById('authOverlay');
    const profileOverlay = document.getElementById('profileOverlay');
    
    if (authOverlay) {
        authOverlay.addEventListener('click', function(e) {
            if (e.target === authOverlay) {
                closeAuthModal();
            }
        });
    }
    
    if (profileOverlay) {
        profileOverlay.addEventListener('click', function(e) {
            if (e.target === profileOverlay) {
                closeProfileModal();
            }
        });
    }
}

// Check Authentication Status
function checkAuthStatus() {
    if (currentUser && authToken) {
        showUserMenu();
        updateUIForLoggedInUser();
    } else {
        showAuthButtons();
        updateUIForLoggedOutUser();
    }
}

// Show Authentication Buttons
function showAuthButtons() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    
    if (authButtons) authButtons.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
}

// Show User Menu
function showUserMenu() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    
    if (authButtons) authButtons.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    if (userName && currentUser) {
        userName.textContent = currentUser.firstName || 'User';
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Login successful
            authToken = data.data.token;
            currentUser = data.data.user;
            
            // Save to localStorage
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update UI
            checkAuthStatus();
            closeAuthModal();
            showNotification('Login successful! Welcome back!');
            
            // Clear form
            document.getElementById('loginForm').reset();
        } else {
            showNotification(data.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Network error. Please check your connection.');
    }
}

// Handle Signup
async function handleSignup(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('signupFirstName').value;
    const lastName = document.getElementById('signupLastName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!');
        return;
    }
    
    // Validate password strength
    if (!validatePassword(password)) {
        showNotification('Password must contain at least 6 characters with uppercase, lowercase, and number');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                firstName, 
                lastName, 
                email, 
                phone, 
                password 
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Signup successful
            authToken = data.data.token;
            currentUser = data.data.user;
            
            // Save to localStorage
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update UI
            checkAuthStatus();
            closeAuthModal();
            showNotification('Account created successfully! Please check your email to verify your account.');
            
            // Clear form
            document.getElementById('signupForm').reset();
        } else {
            showNotification(data.message || 'Signup failed. Please try again.');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Network error. Please check your connection.');
    }
}

// Handle Forgot Password
async function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Password reset link sent to your email!');
            document.getElementById('forgotPasswordForm').reset();
            showLoginForm();
        } else {
            showNotification(data.message || 'Failed to send reset link. Please try again.');
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        showNotification('Network error. Please check your connection.');
    }
}

// Logout Function
function logout() {
    // Clear authentication state
    authToken = null;
    currentUser = null;
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Update UI
    checkAuthStatus();
    showNotification('Logged out successfully!');
    
    // Close user dropdown if open
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) {
        userDropdown.classList.remove('active');
    }
}

// Show Login Form
function showLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const authTitle = document.getElementById('authTitle');
    
    if (loginForm) loginForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
    if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
    if (authTitle) authTitle.textContent = 'Login';
    
    openAuthModal();
}

// Show Signup Form
function showSignupForm() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const authTitle = document.getElementById('authTitle');
    
    if (loginForm) loginForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'block';
    if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
    if (authTitle) authTitle.textContent = 'Sign Up';
    
    openAuthModal();
}

// Show Forgot Password Form
function showForgotPassword() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const authTitle = document.getElementById('authTitle');
    
    if (loginForm) loginForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'none';
    if (forgotPasswordForm) forgotPasswordForm.style.display = 'block';
    if (authTitle) authTitle.textContent = 'Forgot Password';
}

// Open Authentication Modal
function openAuthModal() {
    const authOverlay = document.getElementById('authOverlay');
    if (authOverlay) {
        authOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close Authentication Modal
function closeAuthModal() {
    const authOverlay = document.getElementById('authOverlay');
    if (authOverlay) {
        authOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Toggle User Menu
function toggleUserMenu() {
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) {
        userDropdown.classList.toggle('active');
    }
}

// Show Profile
function showProfile() {
    if (!currentUser) {
        showNotification('Please login to view your profile.');
        return;
    }
    
    loadUserProfile();
    openProfileModal();
    
    // Close user dropdown
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) {
        userDropdown.classList.remove('active');
    }
}

// Show Orders
function showOrders() {
    if (!currentUser) {
        showNotification('Please login to view your orders.');
        return;
    }
    
    showNotification('Orders feature coming soon!');
    
    // Close user dropdown
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) {
        userDropdown.classList.remove('active');
    }
}

// Open Profile Modal
function openProfileModal() {
    const profileOverlay = document.getElementById('profileOverlay');
    if (profileOverlay) {
        profileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close Profile Modal
function closeProfileModal() {
    const profileOverlay = document.getElementById('profileOverlay');
    if (profileOverlay) {
        profileOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Validate Password
function validatePassword(password) {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
}

// Update UI for Logged In User
function updateUIForLoggedInUser() {
    // Add access control to protected features
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.style.display = 'block';
    });
    
    // Enable checkout functionality
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = false;
    }
}

// Update UI for Logged Out User
function updateUIForLoggedOutUser() {
    // Show login prompts for protected features
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!currentUser) {
                e.preventDefault();
                showNotification('Please login to add items to cart!');
                showLoginForm();
            }
        });
    });
    
    // Disable checkout for non-logged in users
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            if (!currentUser) {
                e.preventDefault();
                showNotification('Please login to proceed with checkout!');
                showLoginForm();
            }
        });
    }
}

// Load User Profile
async function loadUserProfile() {
    if (!authToken) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.data.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            displayUserProfile(currentUser);
        } else {
            showNotification('Failed to load profile data.');
        }
    } catch (error) {
        console.error('Profile load error:', error);
        showNotification('Network error loading profile.');
    }
}

// Display User Profile
function displayUserProfile(user) {
    const profileContent = document.getElementById('profileContent');
    if (!profileContent) return;
    
    profileContent.innerHTML = `
        <div class="profile-info">
            <div class="form-group">
                <label>First Name</label>
                <input type="text" id="profileFirstName" value="${user.firstName || ''}" readonly>
            </div>
            <div class="form-group">
                <label>Last Name</label>
                <input type="text" id="profileLastName" value="${user.lastName || ''}" readonly>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="profileEmail" value="${user.email || ''}" readonly>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="tel" id="profilePhone" value="${user.phone || ''}" readonly>
            </div>
            <div class="form-group">
                <label>Email Verified</label>
                <input type="text" value="${user.isEmailVerified ? 'Yes' : 'No'}" readonly>
            </div>
            <div class="form-group">
                <label>Member Since</label>
                <input type="text" value="${new Date(user.createdAt).toLocaleDateString()}" readonly>
            </div>
        </div>
        <div class="profile-actions">
            <button class="btn-secondary" onclick="closeProfileModal()">Close</button>
            <button class="btn-primary" onclick="logout()">Logout</button>
        </div>
    `;
}

// API Helper Function
async function apiRequest(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (authToken) {
        defaultOptions.headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const finalOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, finalOptions);
        const data = await response.json();
        
        if (response.status === 401) {
            // Token expired or invalid
            logout();
            showNotification('Session expired. Please login again.');
            return null;
        }
        
        return { response, data };
    } catch (error) {
        console.error('API request error:', error);
        return null;
    }
}

// ==================== ACTIVITY TRACKING FUNCTIONS ====================

// Initialize Activity Tracking
function initializeActivityTracking() {
    // Track page view
    trackPageView();
    
    // Track user interactions
    setupActivityEventListeners();
    
    // Track page leave
    window.addEventListener('beforeunload', trackPageLeave);
    
    // Track errors
    window.addEventListener('error', trackError);
    
    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', trackPromiseRejection);
}

// Track Page View
function trackPageView() {
    if (pageViewTracked) return;
    
    trackActivity('page_view', {
        pageLoadTime: performance.timing ? 
            performance.timing.loadEventEnd - performance.timing.navigationStart : null,
        referrer: document.referrer,
        timestamp: new Date()
    });
    
    pageViewTracked = true;
}

// Track Page Leave
function trackPageLeave() {
    const timeOnPage = Date.now() - sessionStartTime;
    trackActivity('page_leave', {
        timeOnPage,
        timestamp: new Date()
    });
}

// Track Error
function trackError(event) {
    trackActivity('error_occurred', {
        error: {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error ? event.error.stack : null
        },
        severity: 'high',
        timestamp: new Date()
    });
}

// Track Promise Rejection
function trackPromiseRejection(event) {
    trackActivity('error_occurred', {
        error: {
            message: 'Unhandled Promise Rejection',
            reason: event.reason,
            stack: event.reason ? event.reason.stack : null
        },
        severity: 'medium',
        timestamp: new Date()
    });
}

// Setup Activity Event Listeners
function setupActivityEventListeners() {
    // Track navigation clicks
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a');
        if (target && target.href) {
            trackActivity('navigation_click', {
                url: target.href,
                text: target.textContent.trim(),
                timestamp: new Date()
            });
        }
    });
    
    // Track menu clicks
    document.addEventListener('click', function(e) {
        if (e.target.closest('.nav-menu') || e.target.closest('.menu-toggle')) {
            trackActivity('menu_click', {
                element: e.target.tagName,
                text: e.target.textContent.trim(),
                timestamp: new Date()
            });
        }
    });
    
    // Track footer clicks
    document.addEventListener('click', function(e) {
        if (e.target.closest('.footer')) {
            trackActivity('footer_click', {
                element: e.target.tagName,
                text: e.target.textContent.trim(),
                timestamp: new Date()
            });
        }
    });
    
    // Track search activities
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (e.target.value.trim()) {
                    trackActivity('product_search', {
                        query: e.target.value.trim(),
                        timestamp: new Date()
                    });
                }
            }, 1000);
        });
    }
    
    // Track filter activities
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            trackActivity('product_filter', {
                filter: this.getAttribute('data-filter'),
                text: this.textContent.trim(),
                timestamp: new Date()
            });
        });
    });
}

// Track Product View
function trackProductView(productId, productName) {
    trackActivity('product_view', {
        productId,
        productName,
        timestamp: new Date()
    });
}

// Track Add to Cart
function trackAddToCart(productId, productName, price) {
    trackActivity('product_add_to_cart', {
        productId,
        productName,
        price,
        timestamp: new Date()
    });
}

// Track Remove from Cart
function trackRemoveFromCart(productId, productName) {
    trackActivity('product_remove_from_cart', {
        productId,
        productName,
        timestamp: new Date()
    });
}

// Track Cart View
function trackCartView() {
    trackActivity('cart_view', {
        itemCount: cart.length,
        totalValue: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date()
    });
}

// Track Checkout Start
function trackCheckoutStart() {
    trackActivity('cart_checkout_start', {
        itemCount: cart.length,
        totalValue: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date()
    });
}

// Track Contact Form Submit
function trackContactFormSubmit(formData) {
    trackActivity('contact_form_submit', {
        name: formData.name,
        email: formData.email,
        messageLength: formData.message.length,
        timestamp: new Date()
    });
}

// Main Activity Tracking Function
async function trackActivity(activityType, activityData = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}/activities/track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken ? `Bearer ${authToken}` : ''
            },
            body: JSON.stringify({
                activityType,
                activityData,
                page: {
                    url: window.location.href,
                    title: document.title,
                    referrer: document.referrer,
                    path: window.location.pathname
                },
                device: {
                    type: getDeviceType(),
                    browser: getBrowserInfo(),
                    os: getOSInfo(),
                    screenResolution: `${screen.width}x${screen.height}`,
                    language: navigator.language,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                performance: {
                    pageLoadTime: performance.timing ? 
                        performance.timing.loadEventEnd - performance.timing.navigationStart : null
                }
            })
        });
        
        if (!response.ok) {
            console.warn('Failed to track activity:', response.statusText);
        }
    } catch (error) {
        console.warn('Activity tracking error:', error);
    }
}

// Helper functions for device detection
function getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
}

function getBrowserInfo() {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    if (ua.includes('Opera')) return 'Opera';
    return 'Unknown';
}

function getOSInfo() {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
}

// Add loading animation for better UX
function showLoading() {
    productsGrid.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;
}

// Simulate loading time for better UX
function simulateLoading() {
    showLoading();
    setTimeout(() => {
        displayProducts(products);
    }, 1000);
}

// Initialize with loading animation
document.addEventListener('DOMContentLoaded', function() {
    simulateLoading();
    setupEventListeners();
    loadCartFromStorage();
    updateCartDisplay();
});

// Example: Add this after your product rendering logic
document.addEventListener('DOMContentLoaded', function() {
  // Delegate click event for product images
  document.getElementById('productsGrid').addEventListener('click', function(e) {
    const card = e.target.closest('.product-card');
    if (card && e.target.tagName === 'IMG') {
      // Get product data from card (customize selectors as per your markup)
      const img = card.querySelector('img').src;
      const title = card.querySelector('.product-title')?.textContent || '';
      const summary = card.querySelector('.product-summary')?.textContent || 'No summary available.';

      // Fill modal
      document.getElementById('modalImage').src = img;
      document.getElementById('modalTitle').textContent = title;
      document.getElementById('modalSummary').textContent = summary;

      // Show modal
      document.getElementById('productModal').style.display = 'flex';

      // Store product id for cart/buy actions if needed
      document.getElementById('addToCartBtn').dataset.productId = card.dataset.productId;
      document.getElementById('buyNowBtn').dataset.productId = card.dataset.productId;
    }
  });

  // Close modal
  document.getElementById('closeModal').onclick = function() {
    document.getElementById('productModal').style.display = 'none';
  };
  window.onclick = function(event) {
    if (event.target === document.getElementById('productModal')) {
      document.getElementById('productModal').style.display = 'none';
    }
  };

  // Add to Cart and Buy Now handlers
  document.getElementById('addToCartBtn').onclick = function() {
    const productId = this.dataset.productId;
    // Call your addToCart logic here
    alert('Added to cart: ' + productId);
    document.getElementById('productModal').style.display = 'none';
  };
  document.getElementById('buyNowBtn').onclick = function() {
    const productId = this.dataset.productId;
    // Call your buyNow logic here
    alert('Proceed to buy: ' + productId);
    document.getElementById('productModal').style.display = 'none';
  };
});