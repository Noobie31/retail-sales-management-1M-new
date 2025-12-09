const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  tid: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },

  cid: {
    type: String,
    required: true,
    index: true
  },
  cname: {
    type: String,
    required: true,
    index: true
  },
  phone: {
    type: String,
    required: true,
    index: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    index: true
  },
  age: {
    type: Number,
    required: true,
    index: true
  },
  region: {
    type: String,
    required: true,
    index: true
  },
  ctype: {
    type: String,
    required: true
  },

  pid: {
    type: String,
    required: true,
    index: true
  },
  pname: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  tags: [{
    type: String,
    index: true
  }],

  qty: {
    type: Number,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  final: {
    type: Number,
    required: true
  },

  date: {
    type: Date,
    required: true,
    index: true
  },
  payment: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    required: true
  },
  delivery: {
    type: String,
    required: true
  },
  sid: {
    type: String,
    required: true
  },
  sloc: {
    type: String,
    required: true
  },
  spid: {
    type: String,
    required: true
  },
  ename: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

salesSchema.index({ cname: 'text', phone: 'text' });
salesSchema.index({ date: -1, qty: -1 });
salesSchema.index({ region: 1, gender: 1, category: 1 });

module.exports = mongoose.model('Sales', salesSchema);