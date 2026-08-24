// Millance Store — shared type documentation (JS comments only, no TypeScript)
// These are kept comments for editor autocomplete

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {number} [originalPrice]
 * @property {number} [discount]
 * @property {string} image
 * @property {string[]} [images]
 * @property {string} category
 * @property {number} rating
 * @property {number} reviews
 * @property {boolean} inStock
 * @property {string} [badge]
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} icon
 * @property {string} [image]
 * @property {number} [count]
 */

/**
 * @typedef {Object} CartItem
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {string} image
 * @property {number} quantity
 */

/**
 * @typedef {Object} WishlistItem
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {string} image
 * @property {string} addedAt
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} [avatar]
 * @property {Address[]} addresses
 */

/**
 * @typedef {Object} Address
 * @property {string} id
 * @property {string} name
 * @property {string} phone
 * @property {string} addressLine1
 * @property {string} [addressLine2]
 * @property {string} city
 * @property {string} state
 * @property {string} pincode
 * @property {boolean} isDefault
 */
