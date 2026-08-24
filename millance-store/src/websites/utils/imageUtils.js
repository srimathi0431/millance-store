// IMAGE UTILITY SYSTEM
// Ensures every card has a high-quality, relevant image
// Automatic fallback system prevents broken/missing images

export const PRODUCT_IMAGES = {
  'iphone': [
    'https://images.unsplash.com/photo-1592286927505-2fd27df8db82?w=800&h=800&fit=crop&q=90',
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop&q=90',
  ],
  'samsung': [
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop&q=90',
    'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&h=800&fit=crop&q=90',
  ],
  'oneplus': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&q=90',
  ],
  'redmi': [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop&q=90',
  ],
  'mobile': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&q=90',
  ],
  'macbook': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop&q=90',
    'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=800&h=800&fit=crop&q=90',
  ],
  'laptop': [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop&q=90',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop&q=90',
  ],
  'dell': ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop&q=90'],
  'hp':   ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop&q=90'],
  'tv': [
    'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=800&fit=crop&q=90',
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop&q=90',
  ],
  'camera': [
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop&q=90',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop&q=90',
  ],
  'headphone': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop&q=90',
  ],
  'airpods': ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop&q=90'],
  'speaker': ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop&q=90'],
  'watch': [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&q=90',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop&q=90',
  ],
  'washing machine': ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=800&fit=crop&q=90'],
  'refrigerator':    ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&h=800&fit=crop&q=90'],
  'air conditioner': ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=800&fit=crop&q=90'],
  'microwave':       ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=800&fit=crop&q=90'],
  'shirt':   ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=800&fit=crop&q=90'],
  't-shirt': ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop&q=90'],
  'jeans':   ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop&q=90'],
  'dress':   ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=800&fit=crop&q=90'],
  'kurta':   ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=800&fit=crop&q=90'],
  'top':     ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop&q=90'],
  'shoes':   ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop&q=90'],
  'sneakers':['https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&h=800&fit=crop&q=90'],
  'bag':     ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop&q=90'],
  'backpack':['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop&q=90'],
  'tomato':  ['https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800&h=800&fit=crop&q=90'],
  'onion':   ['https://images.unsplash.com/photo-1508747703725-719777637510?w=800&h=800&fit=crop&q=90'],
  'potato':  ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&h=800&fit=crop&q=90'],
  'carrot':  ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&h=800&fit=crop&q=90'],
  'vegetable':['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=800&fit=crop&q=90'],
  'apple':   ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&h=800&fit=crop&q=90'],
  'banana':  ['https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800&h=800&fit=crop&q=90'],
  'orange':  ['https://images.unsplash.com/photo-1547514701-42782101795e?w=800&h=800&fit=crop&q=90'],
  'mango':   ['https://images.unsplash.com/photo-1605027990121-cbae9fc3370f?w=800&h=800&fit=crop&q=90'],
  'grape':   ['https://images.unsplash.com/photo-1423483641154-5411ec9c0ddf?w=800&h=800&fit=crop&q=90'],
  'fruit':   ['https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&h=800&fit=crop&q=90'],
  'milk':    ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=800&fit=crop&q=90'],
  'butter':  ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&h=800&fit=crop&q=90'],
  'cheese':  ['https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800&h=800&fit=crop&q=90'],
  'yogurt':  ['https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=800&h=800&fit=crop&q=90'],
  'dairy':   ['https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&h=800&fit=crop&q=90'],
  'bread':   ['https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800&h=800&fit=crop&q=90'],
  'cake':    ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=800&fit=crop&q=90'],
  'biscuit': ['https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=800&h=800&fit=crop&q=90'],
  'cookie':  ['https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=800&fit=crop&q=90'],
  'chicken': ['https://images.unsplash.com/photo-1588347818036-4c6e679e6ab0?w=800&h=800&fit=crop&q=90'],
  'fish':    ['https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?w=800&h=800&fit=crop&q=90'],
  'egg':     ['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&h=800&fit=crop&q=90'],
  'serum':   ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop&q=90'],
  'lipstick':['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=800&fit=crop&q=90'],
  'beauty':  ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop&q=90'],
  'sofa':    ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&q=90'],
  'furniture':['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&q=90'],
  'toy':     ['https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&h=800&fit=crop&q=90'],
  'book':    ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop&q=90'],
  'sports':  ['https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=800&fit=crop&q=90'],
};

const FALLBACK_IMAGES = {
  electronics: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&h=800&fit=crop&q=90',
  fashion:     'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&h=800&fit=crop&q=90',
  grocery:     'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=800&fit=crop&q=90',
  home:        'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=800&fit=crop&q=90',
  beauty:      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop&q=90',
  default:     'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=800&fit=crop&q=90',
};

export function getProductImage(productName, existingImage) {
  if (existingImage && existingImage.startsWith('http')) return existingImage;
  const lower = productName.toLowerCase();
  for (const [key, images] of Object.entries(PRODUCT_IMAGES)) {
    if (lower.includes(key)) return images[0];
  }
  if (lower.includes('phone') || lower.includes('mobile')) return [0];
  if (lower.includes('laptop') || lower.includes('computer')) return [0];
  if (lower.includes('fashion') || lower.includes('clothing')) return FALLBACK_IMAGES.fashion;
  if (lower.includes('food') || lower.includes('grocery')) return FALLBACK_IMAGES.grocery;
  return FALLBACK_IMAGES.default;
}

export function getImageWithFallbacks(productName, existingImage) {
  const primary = getProductImage(productName, existingImage);
  const fallbacks = [
    primary,
    FALLBACK_IMAGES.default,
    'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&h=800&fit=crop&q=90',
  ];
  return [...new Set(fallbacks)];
}

export function getCategoryImage(categoryName, existingImage) {
  if (existingImage && existingImage.startsWith('http')) return existingImage;
  const lower = categoryName.toLowerCase();
  for (const [key, images] of Object.entries(PRODUCT_IMAGES)) {
    if (lower.includes(key)) return images[0];
  }
  if (lower.includes('electronic') || lower.includes('mobile')) return FALLBACK_IMAGES.electronics;
  if (lower.includes('fashion') || lower.includes('cloth')) return FALLBACK_IMAGES.fashion;
  if (lower.includes('grocery') || lower.includes('food')) return FALLBACK_IMAGES.grocery;
  if (lower.includes('home') || lower.includes('kitchen')) return FALLBACK_IMAGES.home;
  if (lower.includes('beauty') || lower.includes('personal')) return FALLBACK_IMAGES.beauty;
  return FALLBACK_IMAGES.default;
}

export function handleImageError(event, fallbacks) {
  const img = event.currentTarget;
  const currentIndex = fallbacks.findIndex(url => url === img.src);
  if (currentIndex < fallbacks.length - 1) {
    img.src = fallbacks[currentIndex + 1];
  } else {
    img.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    img.style.opacity = '0.8';
  }
}
