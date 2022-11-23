const Supplier = require("./supplier");

var Purchase = {
    id: Number,
    supplier: Supplier,
    date: Date,
    detailsPurchase: []
}

module.exports = Purchase;