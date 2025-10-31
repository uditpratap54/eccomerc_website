const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShopSchema = new Schema({
  name: { type: String, required: true },
  city: { type: String, required: true, index: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  whatsapp: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] }
  },
  categories: [String],
  images: [String],
  openingHours: String,
  ownerUserId: { type: Schema.Types.ObjectId, ref: 'User' },
  verified: { type: Boolean, default: false }
}, { timestamps: true });

ShopSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Shop', ShopSchema);
ShopSchema.add({ views: { type: Number, default: 0 } });