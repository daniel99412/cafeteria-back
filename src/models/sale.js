const DetailSale = require("./detailSale");
const Employee = require("./employee");

var Sale = {
    id: Number,
    employee: Employee,
    date: Date,
    detailsSale: [],
}

module.exports = Sale;