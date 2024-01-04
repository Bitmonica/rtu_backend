const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PairSchema = new Schema(
  {
    "id": { type: String, required: true, unique : true },
    "created": { type: Number, required: true },
    // "createdAt": { type: Date, require: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('pair', PairSchema);
