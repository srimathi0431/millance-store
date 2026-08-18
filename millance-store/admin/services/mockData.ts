// ═══════════════════════════════════════════════════════
// MILLANCE ADMIN — COMPLETE MOCK DATA v3
// 25 root categories · 80+ subcategories · 50+ products
// ═══════════════════════════════════════════════════════

export const MOCK_ADMIN = {
  id: 1, name: 'Super Admin', email: 'admin@millance.gold',
  role: 'SUPER_ADMIN', permissions: [], is_active: true,
  last_login_at: '2026-08-12T10:00:00Z',
  created_at: '2026-01-01T00:00:00Z', updated_at: '2026-08-12T10:00:00Z',
};

export const MOCK_CREDENTIALS = {
  admin:  { email: 'admin@millance.gold',  password: '12345678' },
  vendor: { email: 'vendor@millance.gold', password: '12345678' },
};

// ─────────────────────────────────────────────────────
// ROOT CATEGORIES (25)
// ─────────────────────────────────────────────────────
const ROOT_CATS = [
  { id:1,  name:'Men',            slug:'men',            description:"Men's fashion & clothing",       sort_order:1  },
  { id:2,  name:'Women',          slug:'women',          description:"Women's fashion & clothing",     sort_order:2  },
  { id:3,  name:'Kids',           slug:'kids',           description:'Kids clothing & accessories',    sort_order:3  },
  { id:4,  name:'Electronics',    slug:'electronics',    description:'Electronics & gadgets',          sort_order:4  },
  { id:5,  name:'Footwear',       slug:'footwear',       description:'Shoes, sandals & boots',         sort_order:5  },
  { id:6,  name:'Beauty',         slug:'beauty',         description:'Beauty, skin & hair care',       sort_order:6  },
  { id:7,  name:'Home & Kitchen', slug:'home-kitchen',   description:'Home essentials & cookware',     sort_order:7  },
  { id:8,  name:'Accessories',    slug:'accessories',    description:'Bags, watches & jewellery',      sort_order:8  },
  { id:9,  name:'Sports',         slug:'sports',         description:'Sports & fitness gear',          sort_order:9  },
  { id:10, name:'Books',          slug:'books',          description:'Books & stationery',             sort_order:10 },
  { id:11, name:'Grocery',        slug:'grocery',        description:'Food & grocery essentials',      sort_order:11 },
  { id:12, name:'Toys & Games',   slug:'toys-games',     description:'Toys, games & play',             sort_order:12 },
  { id:13, name:'Automotive',     slug:'automotive',     description:'Car & bike accessories',         sort_order:13 },
  { id:14, name:'Furniture',      slug:'furniture',      description:'Furniture & home décor',         sort_order:14 },
  { id:15, name:'Jewellery',      slug:'jewellery',      description:'Gold, silver & fashion jewellery',sort_order:15},
  { id:16, name:'Health',         slug:'health',         description:'Health & wellness products',     sort_order:16 },
  { id:17, name:'Pet Supplies',   slug:'pet-supplies',   description:'Products for your pets',         sort_order:17 },
  { id:18, name:'Music',          slug:'music',          description:'Musical instruments',            sort_order:18 },
  { id:19, name:'Office',         slug:'office',         description:'Office & stationery supplies',   sort_order:19 },
  { id:20, name:'Garden',         slug:'garden',         description:'Gardening tools & plants',       sort_order:20 },
  { id:21, name:'Appliances',     slug:'appliances',     description:'Large home appliances',          sort_order:21 },
  { id:22, name:'Luggage',        slug:'luggage',        description:'Bags, suitcases & travel',       sort_order:22 },
  { id:23, name:'Baby',           slug:'baby',           description:'Baby care & products',           sort_order:23 },
  { id:24, name:'Cameras',        slug:'cameras',        description:'Cameras & photography',          sort_order:24 },
  { id:25, name:'Gaming',         slug:'gaming',         description:'Gaming consoles & accessories',  sort_order:25 },
].map(c => ({ ...c, image_url:'', parent_id:null, is_active:true, created_at:'2026-01-01T00:00:00Z', updated_at:'2026-01-01T00:00:00Z' }));

// ─────────────────────────────────────────────────────
// SUBCATEGORIES (80+)
// ─────────────────────────────────────────────────────
const SUB_CATS = [
  // Men (1)
  { id:101, name:'Men Shirts',         slug:'men-shirts',          parent_id:1,  sort_order:1, is_active:true  },
  { id:102, name:'Men Pants',          slug:'men-pants',           parent_id:1,  sort_order:2, is_active:true  },
  { id:103, name:'Men Jeans',          slug:'men-jeans',           parent_id:1,  sort_order:3, is_active:true  },
  { id:104, name:'Men T-Shirts',       slug:'men-t-shirts',        parent_id:1,  sort_order:4, is_active:true  },
  { id:105, name:'Men Jackets',        slug:'men-jackets',         parent_id:1,  sort_order:5, is_active:true  },
  { id:106, name:'Men Shorts',         slug:'men-shorts',          parent_id:1,  sort_order:6, is_active:true  },
  { id:107, name:'Men Ethnic Wear',    slug:'men-ethnic',          parent_id:1,  sort_order:7, is_active:true  },
  { id:108, name:'Men Suits',          slug:'men-suits',           parent_id:1,  sort_order:8, is_active:false },
  // Women (2)
  { id:201, name:'Women Dresses',      slug:'women-dresses',       parent_id:2,  sort_order:1, is_active:true  },
  { id:202, name:'Women Tops',         slug:'women-tops',          parent_id:2,  sort_order:2, is_active:true  },
  { id:203, name:'Women Sarees',       slug:'women-sarees',        parent_id:2,  sort_order:3, is_active:true  },
  { id:204, name:'Women Kurtis',       slug:'women-kurtis',        parent_id:2,  sort_order:4, is_active:true  },
  { id:205, name:'Women Jeans',        slug:'women-jeans',         parent_id:2,  sort_order:5, is_active:true  },
  { id:206, name:'Women Leggings',     slug:'women-leggings',      parent_id:2,  sort_order:6, is_active:true  },
  { id:207, name:'Women Jackets',      slug:'women-jackets',       parent_id:2,  sort_order:7, is_active:true  },
  { id:208, name:'Women Ethnic Wear',  slug:'women-ethnic',        parent_id:2,  sort_order:8, is_active:true  },
  // Kids (3)
  { id:301, name:'Boys Clothing',      slug:'boys-clothing',       parent_id:3,  sort_order:1, is_active:true  },
  { id:302, name:'Girls Clothing',     slug:'girls-clothing',      parent_id:3,  sort_order:2, is_active:true  },
  { id:303, name:'Baby Clothing',      slug:'baby-clothing',       parent_id:3,  sort_order:3, is_active:true  },
  { id:304, name:'Kids Footwear',      slug:'kids-footwear',       parent_id:3,  sort_order:4, is_active:true  },
  // Electronics (4)
  { id:401, name:'Mobiles',            slug:'mobiles',             parent_id:4,  sort_order:1, is_active:true  },
  { id:402, name:'Laptops',            slug:'laptops',             parent_id:4,  sort_order:2, is_active:true  },
  { id:403, name:'Tablets',            slug:'tablets',             parent_id:4,  sort_order:3, is_active:true  },
  { id:404, name:'Headphones',         slug:'headphones',          parent_id:4,  sort_order:4, is_active:true  },
  { id:405, name:'Smart Watches',      slug:'smart-watches',       parent_id:4,  sort_order:5, is_active:true  },
  { id:406, name:'Speakers',           slug:'speakers',            parent_id:4,  sort_order:6, is_active:true  },
  { id:407, name:'TV & Monitors',      slug:'tv-monitors',         parent_id:4,  sort_order:7, is_active:true  },
  { id:408, name:'Computer Accessories',slug:'comp-accessories',   parent_id:4,  sort_order:8, is_active:true  },
  // Footwear (5)
  { id:501, name:'Men Shoes',          slug:'men-shoes',           parent_id:5,  sort_order:1, is_active:true  },
  { id:502, name:'Women Shoes',        slug:'women-shoes',         parent_id:5,  sort_order:2, is_active:true  },
  { id:503, name:'Sports Shoes',       slug:'sports-shoes',        parent_id:5,  sort_order:3, is_active:true  },
  { id:504, name:'Sandals',            slug:'sandals',             parent_id:5,  sort_order:4, is_active:true  },
  { id:505, name:'Boots',              slug:'boots',               parent_id:5,  sort_order:5, is_active:true  },
  // Beauty (6)
  { id:601, name:'Skin Care',          slug:'skin-care',           parent_id:6,  sort_order:1, is_active:true  },
  { id:602, name:'Hair Care',          slug:'hair-care',           parent_id:6,  sort_order:2, is_active:true  },
  { id:603, name:'Makeup',             slug:'makeup',              parent_id:6,  sort_order:3, is_active:true  },
  { id:604, name:'Fragrances',         slug:'fragrances',          parent_id:6,  sort_order:4, is_active:true  },
  { id:605, name:'Men Grooming',       slug:'men-grooming',        parent_id:6,  sort_order:5, is_active:true  },
  // Home & Kitchen (7)
  { id:701, name:'Cookware',           slug:'cookware',            parent_id:7,  sort_order:1, is_active:true  },
  { id:702, name:'Storage',            slug:'storage',             parent_id:7,  sort_order:2, is_active:true  },
  { id:703, name:'Bedding',            slug:'bedding',             parent_id:7,  sort_order:3, is_active:true  },
  { id:704, name:'Cleaning',           slug:'cleaning',            parent_id:7,  sort_order:4, is_active:true  },
  { id:705, name:'Lighting',           slug:'lighting',            parent_id:7,  sort_order:5, is_active:true  },
  // Accessories (8)
  { id:801, name:'Bags & Handbags',    slug:'bags-handbags',       parent_id:8,  sort_order:1, is_active:true  },
  { id:802, name:'Wallets',            slug:'wallets',             parent_id:8,  sort_order:2, is_active:true  },
  { id:803, name:'Watches',            slug:'watches',             parent_id:8,  sort_order:3, is_active:true  },
  { id:804, name:'Sunglasses',         slug:'sunglasses',          parent_id:8,  sort_order:4, is_active:true  },
  { id:805, name:'Belts',              slug:'belts',               parent_id:8,  sort_order:5, is_active:true  },
  { id:806, name:'Caps & Hats',        slug:'caps-hats',           parent_id:8,  sort_order:6, is_active:true  },
  // Sports (9)
  { id:901, name:'Gym & Fitness',      slug:'gym-fitness',         parent_id:9,  sort_order:1, is_active:true  },
  { id:902, name:'Cricket',            slug:'cricket',             parent_id:9,  sort_order:2, is_active:true  },
  { id:903, name:'Football',           slug:'football',            parent_id:9,  sort_order:3, is_active:true  },
  { id:904, name:'Yoga',               slug:'yoga',                parent_id:9,  sort_order:4, is_active:true  },
  { id:905, name:'Cycling',            slug:'cycling',             parent_id:9,  sort_order:5, is_active:true  },
  // Appliances (21)
  { id:2101, name:'Washing Machines',  slug:'washing-machines',    parent_id:21, sort_order:1, is_active:true  },
  { id:2102, name:'Refrigerators',     slug:'refrigerators',       parent_id:21, sort_order:2, is_active:true  },
  { id:2103, name:'Air Conditioners',  slug:'air-conditioners',    parent_id:21, sort_order:3, is_active:true  },
  { id:2104, name:'Microwaves',        slug:'microwaves',          parent_id:21, sort_order:4, is_active:true  },
  { id:2105, name:'Vacuum Cleaners',   slug:'vacuum-cleaners',     parent_id:21, sort_order:5, is_active:true  },
  { id:2106, name:'Water Purifiers',   slug:'water-purifiers',     parent_id:21, sort_order:6, is_active:true  },
  // Jewellery (15)
  { id:1501, name:'Necklaces',         slug:'necklaces',           parent_id:15, sort_order:1, is_active:true  },
  { id:1502, name:'Earrings',          slug:'earrings',            parent_id:15, sort_order:2, is_active:true  },
  { id:1503, name:'Rings',             slug:'rings',               parent_id:15, sort_order:3, is_active:true  },
  { id:1504, name:'Bracelets',         slug:'bracelets',           parent_id:15, sort_order:4, is_active:true  },
  { id:1505, name:'Anklets',           slug:'anklets',             parent_id:15, sort_order:5, is_active:true  },
  // Grocery (11)
  { id:1101, name:'Dairy & Eggs',      slug:'dairy-eggs',          parent_id:11, sort_order:1, is_active:true  },
  { id:1102, name:'Snacks',            slug:'snacks',              parent_id:11, sort_order:2, is_active:true  },
  { id:1103, name:'Beverages',         slug:'beverages',           parent_id:11, sort_order:3, is_active:true  },
  { id:1104, name:'Staples',           slug:'staples',             parent_id:11, sort_order:4, is_active:true  },
  // Gaming (25)
  { id:2501, name:'PlayStation',       slug:'playstation',         parent_id:25, sort_order:1, is_active:true  },
  { id:2502, name:'Xbox',              slug:'xbox',                parent_id:25, sort_order:2, is_active:true  },
  { id:2503, name:'PC Gaming',         slug:'pc-gaming',           parent_id:25, sort_order:3, is_active:true  },
  { id:2504, name:'Gaming Accessories',slug:'gaming-accessories',  parent_id:25, sort_order:4, is_active:true  },
  // Health (16)
  { id:1601, name:'Vitamins',          slug:'vitamins',            parent_id:16, sort_order:1, is_active:true  },
  { id:1602, name:'Medical Devices',   slug:'medical-devices',     parent_id:16, sort_order:2, is_active:true  },
  { id:1603, name:'Personal Care',     slug:'personal-care',       parent_id:16, sort_order:3, is_active:true  },
  // Automotive (13)
  { id:1301, name:'Car Accessories',   slug:'car-accessories',     parent_id:13, sort_order:1, is_active:true  },
  { id:1302, name:'Bike Accessories',  slug:'bike-accessories',    parent_id:13, sort_order:2, is_active:true  },
  { id:1303, name:'Car Care',          slug:'car-care',            parent_id:13, sort_order:3, is_active:true  },
  // Furniture (14)
  { id:1401, name:'Sofas',             slug:'sofas',               parent_id:14, sort_order:1, is_active:true  },
  { id:1402, name:'Beds & Mattresses', slug:'beds',                parent_id:14, sort_order:2, is_active:true  },
  { id:1403, name:'Tables & Chairs',   slug:'tables-chairs',       parent_id:14, sort_order:3, is_active:true  },
  { id:1404, name:'Wardrobes',         slug:'wardrobes',           parent_id:14, sort_order:4, is_active:true  },
].map(c => ({ ...c, description:'', image_url:'', created_at:'2026-01-01T00:00:00Z', updated_at:'2026-01-01T00:00:00Z' }));

export const MOCK_CATEGORIES: any[] = [...ROOT_CATS, ...SUB_CATS];

// ─────────────────────────────────────────────────────
// PRODUCTS (50+) spread across categories
// ─────────────────────────────────────────────────────
const mkImg = (id:number, color:string, text:string) => ({
  id, image_url:`https://placehold.co/400x400/${color}/white?text=${encodeURIComponent(text)}`,
  alt_text:text, is_primary:true, sort_order:0,
});
const mkVar = (id:number, pid:number, name:string, sku:string, price:number, stock:number, attrs:string) => ({
  id, product_id:pid, name, sku, price, stock, attributes:attrs, is_active:true,
});

export const MOCK_PRODUCTS: any[] = [
  // ── Men Shirts (cat 101) ──
  { id:1, name:'Arrow Oxford Shirt White', slug:'arrow-oxford-white', sku:'ARWX-WHT-001', category_id:101, brand:'Arrow', price:1799, discount_price:1299, status:'ACTIVE', is_featured:true, tax_percent:5, weight:0.25, dimensions:null, description:'Premium cotton oxford shirt.', created_at:'2026-01-10T00:00:00Z', updated_at:'2026-01-10T00:00:00Z',
    images:[mkImg(101,  '1565c0','Oxford Shirt')],
    variants:[mkVar(1001,1,'S/White','ARWX-WHT-S',1299,10,'{"size":"S","color":"White"}'),mkVar(1002,1,'M/White','ARWX-WHT-M',1299,15,'{"size":"M","color":"White"}'),mkVar(1003,1,'L/White','ARWX-WHT-L',1299,8,'{"size":"L","color":"White"}'),mkVar(1004,1,'XL/White','ARWX-WHT-XL',1299,4,'{"size":"XL","color":"White"}'),mkVar(1005,1,'M/Blue','ARWX-BLU-M',1299,0,'{"size":"M","color":"Blue"}')]},
  { id:2, name:'Raymond Formal Shirt Blue', slug:'raymond-formal-blue', sku:'RYMD-BLU-001', category_id:101, brand:'Raymond', price:1999, discount_price:1499, status:'ACTIVE', is_featured:false, tax_percent:5, weight:0.25, dimensions:null, description:'Slim fit formal shirt.', created_at:'2026-01-12T00:00:00Z', updated_at:'2026-01-12T00:00:00Z',
    images:[mkImg(201, '0d47a1','Raymond Shirt')],
    variants:[mkVar(2001,2,'M/Blue','RYMD-BLU-M',1499,12,'{"size":"M","color":"Blue"}'),mkVar(2002,2,'L/Blue','RYMD-BLU-L',1499,9,'{"size":"L","color":"Blue"}'),mkVar(2003,2,'XL/Blue','RYMD-BLU-XL',1499,3,'{"size":"XL","color":"Blue"}')]},
  { id:3, name:'Zara Casual Shirt Check', slug:'zara-casual-check', sku:'ZARA-CHK-001', category_id:101, brand:'Zara', price:2499, discount_price:null, status:'INACTIVE', is_featured:false, tax_percent:5, weight:0.3, dimensions:null, description:'Checkered casual shirt.', created_at:'2026-02-01T00:00:00Z', updated_at:'2026-02-01T00:00:00Z',
    images:[mkImg(301,'4a148c','Zara Shirt')], variants:[]},
  // ── Men Pants (cat 102) ──
  { id:4, name:'Levi Chino Pants Beige', slug:'levi-chino-beige', sku:'LEVI-CHN-001', category_id:102, brand:'Levis', price:2999, discount_price:2199, status:'ACTIVE', is_featured:false, tax_percent:5, weight:0.5, dimensions:null, description:'Slim fit chino pants.', created_at:'2026-01-15T00:00:00Z', updated_at:'2026-01-15T00:00:00Z',
    images:[mkImg(401,'8d6e63','Chino Pants')],
    variants:[mkVar(4001,4,'30/Beige','LEVI-CHN-30',2199,8,'{"waist":"30","color":"Beige"}'),mkVar(4002,4,'32/Beige','LEVI-CHN-32',2199,12,'{"waist":"32","color":"Beige"}'),mkVar(4003,4,'34/Beige','LEVI-CHN-34',2199,5,'{"waist":"34","color":"Beige"}')]},
  // ── Men Jeans (cat 103) ──
  { id:5, name:'Wrangler Slim Fit Jeans', slug:'wrangler-slim-jeans', sku:'WRNGL-JNS-001', category_id:103, brand:'Wrangler', price:2499, discount_price:1799, status:'ACTIVE', is_featured:true, tax_percent:5, weight:0.6, dimensions:null, description:'Classic slim fit jeans.', created_at:'2026-01-20T00:00:00Z', updated_at:'2026-01-20T00:00:00Z',
    images:[mkImg(501,'1a237e','Wrangler Jeans')],
    variants:[mkVar(5001,5,'30/Blue','WRNGL-30-BL',1799,10,'{"waist":"30","color":"Blue"}'),mkVar(5002,5,'32/Blue','WRNGL-32-BL',1799,15,'{"waist":"32","color":"Blue"}'),mkVar(5003,5,'34/Blue','WRNGL-34-BL',1799,0,'{"waist":"34","color":"Blue"}'),mkVar(5004,5,'32/Black','WRNGL-32-BK',1799,7,'{"waist":"32","color":"Black"}')]},
  // ── Women Dresses (cat 201) ──
  { id:6, name:'Floral Wrap Dress Pink', slug:'floral-wrap-pink', sku:'DRSS-FLR-001', category_id:201, brand:'Millance', price:1999, discount_price:1499, status:'ACTIVE', is_featured:true, tax_percent:5, weight:0.3, dimensions:null, description:'Elegant floral wrap dress.', created_at:'2026-02-10T00:00:00Z', updated_at:'2026-02-10T00:00:00Z',
    images:[mkImg(601,'e91e63','Floral Dress')],
    variants:[mkVar(6001,6,'XS/Pink','DRSS-FLR-XS',1499,3,'{"size":"XS","color":"Pink"}'),mkVar(6002,6,'S/Pink','DRSS-FLR-S',1499,8,'{"size":"S","color":"Pink"}'),mkVar(6003,6,'M/Pink','DRSS-FLR-M',1499,12,'{"size":"M","color":"Pink"}'),mkVar(6004,6,'L/Pink','DRSS-FLR-L',1499,0,'{"size":"L","color":"Pink"}'),mkVar(6005,6,'XL/Pink','DRSS-FLR-XL',1499,4,'{"size":"XL","color":"Pink"}')]},
  { id:7, name:'A-Line Midi Dress Navy', slug:'aline-midi-navy', sku:'DRSS-ALN-001', category_id:201, brand:'H&M', price:2799, discount_price:2199, status:'ACTIVE', is_featured:false, tax_percent:5, weight:0.35, dimensions:null, description:'Classic A-line midi dress.', created_at:'2026-02-15T00:00:00Z', updated_at:'2026-02-15T00:00:00Z',
    images:[mkImg(701,'0d47a1','Midi Dress')],
    variants:[mkVar(7001,7,'S/Navy','DRSS-ALN-S',2199,6,'{"size":"S","color":"Navy"}'),mkVar(7002,7,'M/Navy','DRSS-ALN-M',2199,10,'{"size":"M","color":"Navy"}'),mkVar(7003,7,'L/Navy','DRSS-ALN-L',2199,4,'{"size":"L","color":"Navy"}')]},
  // ── Electronics - Mobiles (cat 401) ──
  { id:8, name:'iPhone 15 Pro Max', slug:'iphone-15-pro-max', sku:'APPL-IPH15PM', category_id:401, brand:'Apple', price:134900, discount_price:129900, status:'ACTIVE', is_featured:true, tax_percent:18, weight:0.221, dimensions:'16x7x0.8cm', description:'Latest Apple flagship.', created_at:'2026-01-15T00:00:00Z', updated_at:'2026-01-15T00:00:00Z',
    images:[mkImg(801,'1a1a2e','iPhone 15')],
    variants:[mkVar(8001,8,'256GB/Natural','APPL-IPH15-256NT',134900,8,'{"storage":"256GB","color":"Natural Titanium"}'),mkVar(8002,8,'512GB/Black','APPL-IPH15-512BK',149900,5,'{"storage":"512GB","color":"Black Titanium"}')]},
  { id:9, name:'Samsung Galaxy S24', slug:'samsung-galaxy-s24', sku:'SMSG-GS24', category_id:401, brand:'Samsung', price:79999, discount_price:74999, status:'ACTIVE', is_featured:true, tax_percent:18, weight:0.195, dimensions:'15x7x0.7cm', description:'Samsung flagship 2024.', created_at:'2026-01-20T00:00:00Z', updated_at:'2026-01-20T00:00:00Z',
    images:[mkImg(901,'0d47a1','Samsung S24')],
    variants:[mkVar(9001,9,'256GB/Black','SMSG-GS24-256BK',79999,12,'{"storage":"256GB","color":"Phantom Black"}'),mkVar(9002,9,'256GB/Gray','SMSG-GS24-256GR',79999,8,'{"storage":"256GB","color":"Marble Gray"}')]},
  { id:10, name:'Redmi Note 13 Pro', slug:'redmi-note-13-pro', sku:'RDMI-N13P', category_id:401, brand:'Xiaomi', price:24999, discount_price:21999, status:'ACTIVE', is_featured:false, tax_percent:18, weight:0.187, dimensions:'16x7x0.8cm', description:'Value flagship killer.', created_at:'2026-02-01T00:00:00Z', updated_at:'2026-02-01T00:00:00Z',
    images:[mkImg(1001,'263238','Redmi Note 13')],
    variants:[mkVar(10001,10,'8GB+256GB','RDMI-N13P-256',21999,20,'{"ram":"8GB","storage":"256GB"}')]},
  // ── Electronics - Laptops (cat 402) ──
  { id:11, name:'Dell Inspiron 15 i5', slug:'dell-inspiron-15', sku:'DELL-INS15-I5', category_id:402, brand:'Dell', price:65990, discount_price:58990, status:'ACTIVE', is_featured:false, tax_percent:18, weight:1.8, dimensions:'35x24x2cm', description:'15.6" FHD Intel i5 laptop.', created_at:'2026-02-05T00:00:00Z', updated_at:'2026-02-05T00:00:00Z',
    images:[mkImg(1101,'37474f','Dell Laptop')],
    variants:[mkVar(11001,11,'i5/8GB/512GB','DELL-INS15-8G',58990,6,'{"processor":"Intel i5","ram":"8GB","storage":"512GB"}'),mkVar(11002,11,'i5/16GB/512GB','DELL-INS15-16G',64990,3,'{"processor":"Intel i5","ram":"16GB","storage":"512GB"}')]},
  { id:12, name:'MacBook Air M2', slug:'macbook-air-m2', sku:'APPL-MBA-M2', category_id:402, brand:'Apple', price:114900, discount_price:109900, status:'ACTIVE', is_featured:true, tax_percent:18, weight:1.24, dimensions:'30x21x1.1cm', description:'Ultra-thin M2 chip laptop.', created_at:'2026-02-10T00:00:00Z', updated_at:'2026-02-10T00:00:00Z',
    images:[mkImg(1201,'1a1a2e','MacBook Air M2')],
    variants:[mkVar(12001,12,'8GB/256GB/Silver','APPL-MBA-M2-256S',114900,4,'{"ram":"8GB","storage":"256GB","color":"Silver"}'),mkVar(12002,12,'8GB/512GB/Space Gray','APPL-MBA-M2-512G',134900,2,'{"ram":"8GB","storage":"512GB","color":"Space Gray"}')]},
  // ── Electronics - Headphones (cat 404) ──
  { id:13, name:'boAt Airdopes 141', slug:'boat-airdopes-141', sku:'BOAT-AD141', category_id:404, brand:'boAt', price:1499, discount_price:999, status:'ACTIVE', is_featured:true, tax_percent:18, weight:0.05, dimensions:'6x4x3cm', description:'TWS earbuds 42H battery.', created_at:'2026-03-10T00:00:00Z', updated_at:'2026-03-10T00:00:00Z',
    images:[mkImg(1301,'212121','boAt Airdopes')],
    variants:[mkVar(13001,13,'Black','BOAT-AD141-BK',999,50,'{"color":"Active Black"}'),mkVar(13002,13,'White','BOAT-AD141-WH',999,35,'{"color":"Arctic White"}'),mkVar(13003,13,'Blue','BOAT-AD141-BB',999,20,'{"color":"Berry Blue"}')]},
  { id:14, name:'Sony WH-1000XM5', slug:'sony-wh1000xm5', sku:'SONY-WH1000XM5', category_id:404, brand:'Sony', price:29990, discount_price:24990, status:'ACTIVE', is_featured:true, tax_percent:18, weight:0.25, dimensions:'19x8x18cm', description:'Industry-leading noise cancellation.', created_at:'2026-03-15T00:00:00Z', updated_at:'2026-03-15T00:00:00Z',
    images:[mkImg(1401,'37474f','Sony XM5')],
    variants:[mkVar(14001,14,'Black','SONY-XM5-BK',24990,8,'{"color":"Black"}'),mkVar(14002,14,'Silver','SONY-XM5-SV',24990,5,'{"color":"Silver"}')]},
  // ── Electronics - Smart Watches (cat 405) ──
  { id:15, name:'Noise ColorFit Pro 4', slug:'noise-colorfit-pro-4', sku:'NOIS-CFP4', category_id:405, brand:'Noise', price:4999, discount_price:3499, status:'OUT_OF_STOCK', is_featured:false, tax_percent:18, weight:0.045, dimensions:'4x4x1cm', description:'AMOLED smartwatch.', created_at:'2026-04-10T00:00:00Z', updated_at:'2026-04-10T00:00:00Z',
    images:[mkImg(1501,'6a1b9a','Noise Watch')],
    variants:[mkVar(15001,15,'Black','NOIS-CFP4-BK',3499,0,'{"color":"Jet Black"}'),mkVar(15002,15,'Rose Gold','NOIS-CFP4-RG',3499,0,'{"color":"Rose Gold"}')]},
  // ── Appliances - Washing Machines (cat 2101) ──
  { id:16, name:'LG 7Kg Front Load', slug:'lg-7kg-front-load', sku:'LG-WM-7FL', category_id:2101, brand:'LG', price:38990, discount_price:34990, status:'ACTIVE', is_featured:false, tax_percent:18, weight:65, dimensions:'60x50x85cm', description:'7Kg inverter direct drive.', created_at:'2026-02-20T00:00:00Z', updated_at:'2026-02-20T00:00:00Z',
    images:[mkImg(1601,'424242','LG Washing Machine')],
    variants:[mkVar(16001,16,'Silver','LG-WM-7FL-SV',34990,5,'{"color":"Silver","capacity":"7Kg"}')]},
  { id:17, name:'Samsung 6.5Kg Top Load', slug:'samsung-6kg-top-load', sku:'SMSG-WM-65TL', category_id:2101, brand:'Samsung', price:24990, discount_price:21990, status:'ACTIVE', is_featured:false, tax_percent:18, weight:45, dimensions:'55x55x90cm', description:'6.5Kg top load fully automatic.', created_at:'2026-02-25T00:00:00Z', updated_at:'2026-02-25T00:00:00Z',
    images:[mkImg(1701,'1565c0','Samsung WM')],
    variants:[mkVar(17001,17,'White','SMSG-WM-65TL-WH',21990,8,'{"color":"White","capacity":"6.5Kg"}')]},
  // ── Appliances - Refrigerators (cat 2102) ──
  { id:18, name:'Whirlpool 215L Single Door', slug:'whirlpool-215l', sku:'WPOL-RF-215', category_id:2102, brand:'Whirlpool', price:18990, discount_price:16490, status:'ACTIVE', is_featured:false, tax_percent:18, weight:42, dimensions:'50x55x130cm', description:'215L direct cool refrigerator.', created_at:'2026-03-01T00:00:00Z', updated_at:'2026-03-01T00:00:00Z',
    images:[mkImg(1801,'0d47a1','Whirlpool Fridge')],
    variants:[mkVar(18001,18,'Blue','WPOL-RF-215-BL',16490,6,'{"color":"Sapphire Blue"}')]},
  // ── Accessories - Watches (cat 803) ──
  { id:19, name:'Titan Edge Slim Watch', slug:'titan-edge-slim', sku:'TITN-EDGE-001', category_id:803, brand:'Titan', price:8995, discount_price:7495, status:'ACTIVE', is_featured:true, tax_percent:3, weight:0.08, dimensions:'5x5x1cm', description:'Ultra-slim analog watch.', created_at:'2026-03-05T00:00:00Z', updated_at:'2026-03-05T00:00:00Z',
    images:[mkImg(1901,'ffd54f','Titan Watch')],
    variants:[mkVar(19001,19,'Silver/White','TITN-EDGE-SW',7495,10,'{"dial":"White","strap":"Silver"}'),mkVar(19002,19,'Gold/Black','TITN-EDGE-GB',7495,7,'{"dial":"Black","strap":"Gold"}')]},
  // ── Accessories - Bags (cat 801) ──
  { id:20, name:'Wildcraft Laptop Backpack', slug:'wildcraft-laptop-bag', sku:'WLDC-BPK-001', category_id:801, brand:'Wildcraft', price:2999, discount_price:1999, status:'ACTIVE', is_featured:false, tax_percent:12, weight:0.6, dimensions:'30x15x45cm', description:'30L waterproof laptop backpack.', created_url:'2026-03-10T00:00:00Z', created_at:'2026-03-10T00:00:00Z', updated_at:'2026-03-10T00:00:00Z',
    images:[mkImg(2001,'1b5e20','Wildcraft Bag')],
    variants:[mkVar(20001,20,'Black','WLDC-BPK-BK',1999,25,'{"color":"Black"}'),mkVar(20002,20,'Navy','WLDC-BPK-NV',1999,15,'{"color":"Navy Blue"}')]},
  // ── Beauty - Skin Care (cat 601) ──
  { id:21, name:'Lakme Foundation Matte', slug:'lakme-foundation', sku:'LAKM-FND-001', category_id:601, brand:'Lakme', price:649, discount_price:549, status:'INACTIVE', is_featured:false, tax_percent:12, weight:0.08, dimensions:'5x3x8cm', description:'Matte finish SPF 25.', created_at:'2026-03-01T00:00:00Z', updated_at:'2026-03-01T00:00:00Z',
    images:[mkImg(2101,'f48fb1','Lakme Foundation')],
    variants:[mkVar(21001,21,'Shade 01','LAKM-FND-01',549,20,'{"shade":"01 Ivory"}'),mkVar(21002,21,'Shade 03','LAKM-FND-03',549,18,'{"shade":"03 Shell"}'),mkVar(21003,21,'Shade 05','LAKM-FND-05',549,0,'{"shade":"05 Almond"}')]},
  // ── Kids - Boys Clothing (cat 301) ──
  { id:22, name:'Kids Cartoon T-Shirt', slug:'kids-cartoon-tshirt', sku:'KIDS-TSH-001', category_id:301, brand:'Millance Kids', price:399, discount_price:299, status:'ACTIVE', is_featured:false, tax_percent:5, weight:0.15, dimensions:null, description:'Soft cotton cartoon print t-shirt.', created_at:'2026-04-01T00:00:00Z', updated_at:'2026-04-01T00:00:00Z',
    images:[mkImg(2201,'29b6f6','Kids TShirt')],
    variants:[mkVar(22001,22,'2-3Yr/Blue','KIDS-TSH-23-BL',299,15,'{"size":"2-3 Years","color":"Blue"}'),mkVar(22002,22,'4-5Yr/Blue','KIDS-TSH-45-BL',299,10,'{"size":"4-5 Years","color":"Blue"}'),mkVar(22003,22,'6-7Yr/Blue','KIDS-TSH-67-BL',299,8,'{"size":"6-7 Years","color":"Blue"}'),mkVar(22004,22,'4-5Yr/Red','KIDS-TSH-45-RD',299,0,'{"size":"4-5 Years","color":"Red"}')]},
  // ── Footwear - Sports Shoes (cat 503) ──
  { id:23, name:'Nike Air Max 270', slug:'nike-air-max-270', sku:'NIKE-AM270', category_id:503, brand:'Nike', price:12995, discount_price:9995, status:'ACTIVE', is_featured:false, tax_percent:5, weight:0.4, dimensions:'30x20x12cm', description:'Air Max cushioning running shoes.', created_at:'2026-02-01T00:00:00Z', updated_at:'2026-02-01T00:00:00Z',
    images:[mkImg(2301,'e53935','Nike AM270')],
    variants:[mkVar(23001,23,'UK7','NIKE-AM270-7',9995,5,'{"size":"UK 7"}'),mkVar(23002,23,'UK8','NIKE-AM270-8',9995,10,'{"size":"UK 8"}'),mkVar(23003,23,'UK9','NIKE-AM270-9',9995,0,'{"size":"UK 9"}'),mkVar(23004,23,'UK10','NIKE-AM270-10',9995,3,'{"size":"UK 10"}')]},
  // ── Sports - Gym (cat 901) ──
  { id:24, name:'MuscleBlaze Whey Protein 2Kg', slug:'mb-whey-2kg', sku:'MBLZ-WH-2KG', category_id:901, brand:'MuscleBlaze', price:3499, discount_price:2799, status:'ACTIVE', is_featured:false, tax_percent:5, weight:2.1, dimensions:'20x15x10cm', description:'Chocolate whey protein 2kg.', created_at:'2026-02-15T00:00:00Z', updated_at:'2026-02-15T00:00:00Z',
    images:[mkImg(2401,'880e4f','Whey Protein')],
    variants:[mkVar(24001,24,'Chocolate','MBLZ-WH-CHOC',2799,20,'{"flavor":"Chocolate"}'),mkVar(24002,24,'Vanilla','MBLZ-WH-VAN',2799,15,'{"flavor":"Vanilla"}')]},
  // ── Home & Kitchen - Cookware (cat 701) ──
  { id:25, name:'Prestige Pressure Cooker 5L', slug:'prestige-cooker-5l', sku:'PRST-PC-5L', category_id:701, brand:'Prestige', price:2299, discount_price:1799, status:'ACTIVE', is_featured:false, tax_percent:12, weight:1.5, dimensions:'25x20x20cm', description:'5 litre aluminium pressure cooker.', created_at:'2026-03-20T00:00:00Z', updated_at:'2026-03-20T00:00:00Z',
    images:[mkImg(2501,'c62828','Prestige Cooker')],
    variants:[mkVar(25001,25,'3L','PRST-PC-3L',1299,12,'{"capacity":"3L"}'),mkVar(25002,25,'5L','PRST-PC-5L',1799,8,'{"capacity":"5L"}')]},
  // ── Jewellery - Necklaces (cat 1501) ──
  { id:26, name:'Gold Plated Mangalsutra', slug:'gold-mangalsutra', sku:'JWL-MNGS-001', category_id:1501, brand:'Millance Jewels', price:1299, discount_price:999, status:'ACTIVE', is_featured:true, tax_percent:3, weight:0.02, dimensions:null, description:'18K gold plated mangalsutra.', created_at:'2026-04-05T00:00:00Z', updated_at:'2026-04-05T00:00:00Z',
    images:[mkImg(2601,'ffd54f','Mangalsutra')], variants:[]},
  // ── DRAFT products ──
  { id:27, name:'Adidas Track Pants', slug:'adidas-track-pants', sku:'ADID-TP-001', category_id:104, brand:'Adidas', price:2999, discount_price:2199, status:'DRAFT', is_featured:false, tax_percent:5, weight:0.35, dimensions:null, description:'Football track pants.', created_at:'2026-03-15T00:00:00Z', updated_at:'2026-03-15T00:00:00Z',
    images:[mkImg(2701,'1b5e20','Adidas Track')],
    variants:[mkVar(27001,27,'S/Black','ADID-TP-S-BK',2199,0,'{"size":"S","color":"Black"}'),mkVar(27002,27,'M/Black','ADID-TP-M-BK',2199,0,'{"size":"M","color":"Black"}')]},
];

// ─────────────────────────────────────────────────────
// INVENTORY (auto-computed from products)
// ─────────────────────────────────────────────────────
export const MOCK_INVENTORY: any[] = MOCK_PRODUCTS.map(p => {
  const total = p.variants.reduce((s: number, v: any) => s + v.stock, 0);
  const reserved = Math.floor(total * 0.05);
  const available = Math.max(0, total - reserved);
  return {
    id: p.id, product_id: p.id, product_name: p.name, product_sku: p.sku,
    total_stock: total, reserved_stock: reserved, available_stock: available,
    low_stock_threshold: 10,
    is_low_stock: available > 0 && available <= 10,
    is_out_of_stock: available <= 0,
    updated_at: p.updated_at,
  };
});

export const MOCK_INV_HISTORY: Record<number, any[]> = {};
MOCK_PRODUCTS.forEach(p => {
  MOCK_INV_HISTORY[p.id] = [
    { id: p.id*100+1, transaction_type:'STOCK_IN',  quantity:50, previous_stock:0,  new_stock:50, reference_id:null, notes:'Initial stock', admin_id:1, created_at:'2026-01-01T10:00:00Z' },
    { id: p.id*100+2, transaction_type:'STOCK_OUT', quantity:5,  previous_stock:50, new_stock:45, reference_id:'ORD-001', notes:'Order fulfilled', admin_id:1, created_at:'2026-02-01T10:00:00Z' },
  ];
});

// ─────────────────────────────────────────────────────
// CUSTOMERS
// ─────────────────────────────────────────────────────
export const MOCK_CUSTOMERS: any[] = [
  { id:1, name:'Priya Sharma',  email:'priya.sharma@gmail.com',  phone:'9876543210', is_active:true,  is_blocked:false, email_verified:true,  created_at:'2026-01-10T00:00:00Z', updated_at:'2026-01-10T00:00:00Z' },
  { id:2, name:'Rahul Verma',   email:'rahul.verma@gmail.com',   phone:'9812345678', is_active:true,  is_blocked:false, email_verified:true,  created_at:'2026-01-15T00:00:00Z', updated_at:'2026-01-15T00:00:00Z' },
  { id:3, name:'Ananya Patel',  email:'ananya.patel@gmail.com',  phone:'9867453210', is_active:true,  is_blocked:false, email_verified:true,  created_at:'2026-02-01T00:00:00Z', updated_at:'2026-02-01T00:00:00Z' },
  { id:4, name:'Vikram Singh',  email:'vikram.singh@gmail.com',  phone:'9845612378', is_active:false, is_blocked:false, email_verified:false, created_at:'2026-02-10T00:00:00Z', updated_at:'2026-02-10T00:00:00Z' },
  { id:5, name:'Sneha Reddy',   email:'sneha.reddy@gmail.com',   phone:'9734561230', is_active:true,  is_blocked:true,  email_verified:true,  created_at:'2026-03-01T00:00:00Z', updated_at:'2026-03-01T00:00:00Z' },
  { id:6, name:'Arjun Nair',    email:'arjun.nair@gmail.com',    phone:'9923456781', is_active:true,  is_blocked:false, email_verified:true,  created_at:'2026-03-15T00:00:00Z', updated_at:'2026-03-15T00:00:00Z' },
  { id:7, name:'Deepika Joshi', email:'deepika.joshi@gmail.com', phone:'9812765430', is_active:true,  is_blocked:false, email_verified:true,  created_at:'2026-04-01T00:00:00Z', updated_at:'2026-04-01T00:00:00Z' },
  { id:8, name:'Rohit Gupta',   email:'rohit.gupta@gmail.com',   phone:'9876501234', is_active:true,  is_blocked:false, email_verified:false, created_at:'2026-04-10T00:00:00Z', updated_at:'2026-04-10T00:00:00Z' },
];

// ─────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────
export const MOCK_ORDERS: any[] = [
  { id:1, order_number:'ORD-2026-001', customer_id:1, status:'DELIVERED',  total_amount:134900, subtotal:134900, discount_amount:0, tax_amount:20578, shipping_amount:0,  coupon_id:null, shipping_name:'Priya Sharma', shipping_phone:'9876543210', shipping_address:'123 MG Road, Mumbai', notes:null, cancelled_reason:null, created_at:'2026-06-01T10:00:00Z', updated_at:'2026-06-10T10:00:00Z', items:[{id:1,product_id:8,product_name:'iPhone 15 Pro Max',product_sku:'APPL-IPH15PM',variant_id:8001,quantity:1,unit_price:134900,discount_price:null,tax_percent:18,total_price:134900}] },
  { id:2, order_number:'ORD-2026-002', customer_id:2, status:'SHIPPED',    total_amount:79999,  subtotal:79999,  discount_amount:0, tax_amount:12240, shipping_amount:99, coupon_id:null, shipping_name:'Rahul Verma',  shipping_phone:'9812345678', shipping_address:'45 Park Street, Delhi', notes:null, cancelled_reason:null, created_at:'2026-06-05T10:00:00Z', updated_at:'2026-06-08T10:00:00Z', items:[{id:2,product_id:9,product_name:'Samsung Galaxy S24',product_sku:'SMSG-GS24',variant_id:9001,quantity:1,unit_price:79999,discount_price:74999,tax_percent:18,total_price:79999}] },
  { id:3, order_number:'ORD-2026-003', customer_id:3, status:'PROCESSING', total_amount:9995,   subtotal:9995,   discount_amount:0, tax_amount:476,   shipping_amount:49, coupon_id:null, shipping_name:'Ananya Patel', shipping_phone:'9867453210', shipping_address:'78 Brigade Rd, Bangalore', notes:null, cancelled_reason:null, created_at:'2026-07-01T10:00:00Z', updated_at:'2026-07-02T10:00:00Z', items:[{id:3,product_id:23,product_name:'Nike Air Max 270',product_sku:'NIKE-AM270',variant_id:23002,quantity:1,unit_price:9995,discount_price:null,tax_percent:5,total_price:9995}] },
  { id:4, order_number:'ORD-2026-004', customer_id:1, status:'PENDING',    total_amount:34990,  subtotal:34990,  discount_amount:0, tax_amount:5338,  shipping_amount:0,  coupon_id:null, shipping_name:'Priya Sharma', shipping_phone:'9876543210', shipping_address:'123 MG Road, Mumbai', notes:null, cancelled_reason:null, created_at:'2026-08-01T10:00:00Z', updated_at:'2026-08-01T10:00:00Z', items:[{id:4,product_id:16,product_name:'LG 7Kg Front Load',product_sku:'LG-WM-7FL',variant_id:16001,quantity:1,unit_price:34990,discount_price:null,tax_percent:18,total_price:34990}] },
  { id:5, order_number:'ORD-2026-005', customer_id:5, status:'CANCELLED',  total_amount:2998,   subtotal:2998,   discount_amount:0, tax_amount:143,   shipping_amount:49, coupon_id:null, shipping_name:'Sneha Reddy',  shipping_phone:'9734561230', shipping_address:'22 Anna Nagar, Chennai', notes:null, cancelled_reason:'Customer requested', created_at:'2026-07-15T10:00:00Z', updated_at:'2026-07-16T10:00:00Z', items:[{id:5,product_id:6,product_name:'Floral Wrap Dress Pink',product_sku:'DRSS-FLR-001',variant_id:6002,quantity:2,unit_price:1499,discount_price:null,tax_percent:5,total_price:2998}] },
  { id:6, order_number:'ORD-2026-006', customer_id:6, status:'CONFIRMED',  total_amount:1998,   subtotal:1998,   discount_amount:0, tax_amount:306,   shipping_amount:0,  coupon_id:null, shipping_name:'Arjun Nair',   shipping_phone:'9923456781', shipping_address:'5 Koramangala, Bangalore', notes:null, cancelled_reason:null, created_at:'2026-08-05T10:00:00Z', updated_at:'2026-08-05T10:00:00Z', items:[{id:6,product_id:13,product_name:'boAt Airdopes 141',product_sku:'BOAT-AD141',variant_id:13001,quantity:2,unit_price:999,discount_price:null,tax_percent:18,total_price:1998}] },
  { id:7, order_number:'ORD-2026-007', customer_id:7, status:'DELIVERED',  total_amount:24990,  subtotal:24990,  discount_amount:500,tax_amount:3812,  shipping_amount:0,  coupon_id:1,    shipping_name:'Deepika Joshi', shipping_phone:'9812765430', shipping_address:'12 Banjara Hills, Hyderabad', notes:null, cancelled_reason:null, created_at:'2026-07-20T10:00:00Z', updated_at:'2026-07-28T10:00:00Z', items:[{id:7,product_id:14,product_name:'Sony WH-1000XM5',product_sku:'SONY-WH1000XM5',variant_id:14001,quantity:1,unit_price:24990,discount_price:null,tax_percent:18,total_price:24990}] },
  { id:8, order_number:'ORD-2026-008', customer_id:8, status:'PENDING',    total_amount:3499,   subtotal:3499,   discount_amount:0, tax_amount:534,   shipping_amount:49, coupon_id:null, shipping_name:'Rohit Gupta',  shipping_phone:'9876501234', shipping_address:'34 Salt Lake, Kolkata', notes:null, cancelled_reason:null, created_at:'2026-08-10T10:00:00Z', updated_at:'2026-08-10T10:00:00Z', items:[{id:8,product_id:15,product_name:'Noise ColorFit Pro 4',product_sku:'NOIS-CFP4',variant_id:15001,quantity:1,unit_price:3499,discount_price:null,tax_percent:18,total_price:3499}] },
];

// ─────────────────────────────────────────────────────
// PAYMENTS & REFUNDS
// ─────────────────────────────────────────────────────
export const MOCK_PAYMENTS: any[] = [
  { id:1, order_id:1, customer_id:1, amount:134900, currency:'INR', payment_method:'UPI',         gateway:'Razorpay', transaction_id:'pay_001', status:'SUCCESS',  paid_at:'2026-06-01T10:30:00Z', created_at:'2026-06-01T10:00:00Z', updated_at:'2026-06-01T10:30:00Z' },
  { id:2, order_id:2, customer_id:2, amount:79999,  currency:'INR', payment_method:'Credit Card', gateway:'Razorpay', transaction_id:'pay_002', status:'SUCCESS',  paid_at:'2026-06-05T11:00:00Z', created_at:'2026-06-05T10:30:00Z', updated_at:'2026-06-05T11:00:00Z' },
  { id:3, order_id:3, customer_id:3, amount:9995,   currency:'INR', payment_method:'NetBanking',  gateway:'Razorpay', transaction_id:'pay_003', status:'SUCCESS',  paid_at:'2026-07-01T10:15:00Z', created_at:'2026-07-01T10:00:00Z', updated_at:'2026-07-01T10:15:00Z' },
  { id:4, order_id:4, customer_id:1, amount:34990,  currency:'INR', payment_method:'UPI',         gateway:'Razorpay', transaction_id:'pay_004', status:'PENDING',  paid_at:null,                   created_at:'2026-08-01T10:00:00Z', updated_at:'2026-08-01T10:00:00Z' },
  { id:5, order_id:5, customer_id:5, amount:2998,   currency:'INR', payment_method:'Debit Card',  gateway:'Razorpay', transaction_id:'pay_005', status:'REFUNDED', paid_at:'2026-07-15T10:30:00Z', created_at:'2026-07-15T10:00:00Z', updated_at:'2026-07-16T10:00:00Z' },
  { id:6, order_id:6, customer_id:6, amount:1998,   currency:'INR', payment_method:'UPI',         gateway:'Razorpay', transaction_id:'pay_006', status:'SUCCESS',  paid_at:'2026-08-05T10:20:00Z', created_at:'2026-08-05T10:00:00Z', updated_at:'2026-08-05T10:20:00Z' },
  { id:7, order_id:7, customer_id:7, amount:24990,  currency:'INR', payment_method:'Credit Card', gateway:'Razorpay', transaction_id:'pay_007', status:'SUCCESS',  paid_at:'2026-07-20T10:30:00Z', created_at:'2026-07-20T10:00:00Z', updated_at:'2026-07-20T10:30:00Z' },
  { id:8, order_id:8, customer_id:8, amount:3499,   currency:'INR', payment_method:'NetBanking',  gateway:'Razorpay', transaction_id:'pay_008', status:'FAILED',   paid_at:null,                   created_at:'2026-08-10T10:00:00Z', updated_at:'2026-08-10T10:05:00Z' },
];
export const MOCK_REFUNDS: any[] = [
  { id:1, order_id:5, payment_id:5, admin_id:1, amount:2998, reason:'Customer requested', status:'COMPLETED', gateway_refund_id:'ref_001', processed_at:'2026-07-16T10:00:00Z', created_at:'2026-07-16T09:00:00Z', updated_at:'2026-07-16T10:00:00Z' },
];

// ─────────────────────────────────────────────────────
// COUPONS
// ─────────────────────────────────────────────────────
export const MOCK_COUPONS: any[] = [
  { id:1, code:'SAVE500',   description:'Save ₹500 on orders above ₹2000', discount_type:'FIXED',      discount_value:500,  min_order_amount:2000, max_discount_amount:null, usage_limit:100, per_user_limit:1, used_count:23, is_active:true,  starts_at:'2026-01-01T00:00:00Z', expires_at:'2026-12-31T23:59:59Z', created_at:'2026-01-01T00:00:00Z', updated_at:'2026-01-01T00:00:00Z' },
  { id:2, code:'WELCOME10', description:'10% off for new customers',        discount_type:'PERCENTAGE', discount_value:10,   min_order_amount:500,  max_discount_amount:1000, usage_limit:500, per_user_limit:1, used_count:87, is_active:true,  starts_at:'2026-01-01T00:00:00Z', expires_at:'2026-12-31T23:59:59Z', created_at:'2026-01-01T00:00:00Z', updated_at:'2026-01-01T00:00:00Z' },
  { id:3, code:'TECH15',    description:'15% off on electronics',           discount_type:'PERCENTAGE', discount_value:15,   min_order_amount:5000, max_discount_amount:3000, usage_limit:150, per_user_limit:1, used_count:42, is_active:true,  starts_at:'2026-08-01T00:00:00Z', expires_at:'2026-08-31T23:59:59Z', created_at:'2026-07-28T00:00:00Z', updated_at:'2026-07-28T00:00:00Z' },
];

// ─────────────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────────────
export const MOCK_REVIEWS: any[] = [
  { id:1, product_id:8,  customer_id:1, rating:5, title:'Excellent phone!',   body:'Best iPhone ever.',                   status:'APPROVED', is_verified_purchase:true,  created_at:'2026-06-15T10:00:00Z', updated_at:'2026-06-15T10:00:00Z' },
  { id:2, product_id:9,  customer_id:2, rating:4, title:'Great Android phone', body:'Very fast, good battery.',            status:'APPROVED', is_verified_purchase:true,  created_at:'2026-06-18T10:00:00Z', updated_at:'2026-06-18T10:00:00Z' },
  { id:3, product_id:23, customer_id:3, rating:5, title:'Super comfortable',   body:'Best running shoes ever.',            status:'PENDING',  is_verified_purchase:true,  created_at:'2026-07-05T10:00:00Z', updated_at:'2026-07-05T10:00:00Z' },
  { id:4, product_id:6,  customer_id:7, rating:5, title:'Love this dress',     body:'Beautiful, great quality fabric.',    status:'APPROVED', is_verified_purchase:true,  created_at:'2026-07-30T10:00:00Z', updated_at:'2026-07-30T10:00:00Z' },
  { id:5, product_id:13, customer_id:6, rating:5, title:'Amazing earbuds',     body:'Unbelievable sound for this price.', status:'PENDING',  is_verified_purchase:true,  created_at:'2026-08-08T10:00:00Z', updated_at:'2026-08-08T10:00:00Z' },
  { id:6, product_id:8,  customer_id:4, rating:2, title:'Overpriced',          body:'Battery drains fast.',               status:'REJECTED', is_verified_purchase:false, created_at:'2026-07-01T10:00:00Z', updated_at:'2026-07-02T10:00:00Z' },
];

// ─────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────
export const MOCK_DASHBOARD = {
  revenue:  { total_revenue:394760, today_revenue:15490, weekly_revenue:68420, monthly_revenue:182340 },
  orders:   { total_orders:8, today_orders:2, pending_orders:2, confirmed_orders:1, processing_orders:1, shipped_orders:1, delivered_orders:2, cancelled_orders:1 },
  products: { total_products:27, active_products:18, low_stock_products:3, out_of_stock_products:3 },
  customers:{ total_customers:8, active_customers:6, new_today:1 },
  recent_orders: MOCK_ORDERS.slice(0,6).map(o=>({ id:o.id, order_number:o.order_number, customer_id:o.customer_id, status:o.status, total_amount:o.total_amount, created_at:o.created_at })),
  top_products: [
    { product_id:8,  product_name:'iPhone 15 Pro Max',    total_sold:12, total_revenue:1618800 },
    { product_id:13, product_name:'boAt Airdopes 141',    total_sold:45, total_revenue:44955   },
    { product_id:9,  product_name:'Samsung Galaxy S24',   total_sold:8,  total_revenue:639992  },
    { product_id:6,  product_name:'Floral Wrap Dress',    total_sold:28, total_revenue:41972   },
    { product_id:23, product_name:'Nike Air Max 270',     total_sold:22, total_revenue:219890  },
  ],
};

export const MOCK_SALES = [
  { label:'2026-07-14', revenue:18400, orders:5 }, { label:'2026-07-15', revenue:22100, orders:7 },
  { label:'2026-07-16', revenue:15800, orders:4 }, { label:'2026-07-17', revenue:31200, orders:9 },
  { label:'2026-07-18', revenue:27600, orders:8 }, { label:'2026-07-19', revenue:19900, orders:6 },
  { label:'2026-07-20', revenue:42300, orders:11}, { label:'2026-07-21', revenue:38700, orders:10},
  { label:'2026-07-22', revenue:25400, orders:7 }, { label:'2026-07-23', revenue:33800, orders:9 },
  { label:'2026-07-24', revenue:28100, orders:8 }, { label:'2026-07-25', revenue:46200, orders:13},
  { label:'2026-07-26', revenue:35400, orders:10}, { label:'2026-07-27', revenue:41800, orders:12},
];

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────
export function paginate<T>(items: T[], page: number, pageSize: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page, page_size: pageSize, total, total_pages: totalPages };
}

export function getCategoryName(id: number | null | undefined): string {
  if (!id) return '—';
  const cat = MOCK_CATEGORIES.find(c => c.id === id);
  if (!cat) return `#${id}`;
  if (cat.parent_id) {
    const parent = MOCK_CATEGORIES.find(c => c.id === cat.parent_id);
    return parent ? `${parent.name} › ${cat.name}` : cat.name;
  }
  return cat.name;
}

export function getProductsByCategory(categoryId: number): any[] {
  // Returns products that belong to this category OR any of its subcategories
  const subIds = MOCK_CATEGORIES.filter(c => c.parent_id === categoryId).map(c => c.id);
  const allIds = [categoryId, ...subIds];
  return MOCK_PRODUCTS.filter(p => allIds.includes(p.category_id));
}

export function getProductsBySubCategory(subCategoryId: number): any[] {
  return MOCK_PRODUCTS.filter(p => p.category_id === subCategoryId);
}
