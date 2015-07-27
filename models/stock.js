var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

	
var StockSchema = new Schema({
    symbol: { type:String, required: true },
    Change: { type:String, required: true}
});

var Stock = mongoose.model('Stock', StockSchema);

module.exports = Stock;