const mongoose = require("mongoose");
const Schema = mongoose.Schema;
("");

const EthereumCostSchema = new Schema({
  cost: {
    type: Number,
  },
});

module.exports = mongoose.model("EthereumCost", EthereumCostSchema);
