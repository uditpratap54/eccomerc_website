const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true, index: true },
  name: { type: String, required: true, text: true },
  description: { type: String, text: true },
  category: String,
  price: Number,
  image: String,
  sku: String,
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

ProductSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
ProductSchema.add({ views: { type: Number, default: 0 } });