var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var favoriteSchema = new Schema({
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    }
});
module.exports = mongoose.model('Favorite', favoriteSchema);