var _ = require('lodash');
var mongodb = require('./db');

function Order () {
}

Order.getCount = function (callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('items', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.find({}).toArray(function (err, result) {
                mongodb.close();
                if(err) {
                    return callback(err);
                }
                if(!result) {
                    return callback(null, 0);
                }
                var count = _(result).reduce(function (sum, item) {
                    return sum + item.count;
                }, 0);
                callback(null, count);
                mongodb.close();
            });
        });
    });
};


Order.clear = function () {

};

Order.getItem = function (name, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('items', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne({name: name}, function (err, result) {
                mongodb.close();
                if(err) {
                    return callback(err);
                }
                callback(null, result);
            });
        });
    });
};

Order.getPromotion = function () {
    var items = Order.all();
    var promotions = loadPromotions();
    var two_with_one_list = _(promotions).findWhere({type: 'BUY_TWO_GET_ONE_FREE'}).barcodes;
    _(two_with_one_list).each(function (barcode) {
        var item = items[barcode];
        if(item && !item.promotion) {
            item.getPromotion();
        }
    }, this);
};

//Order.totalPrice = function () {
//    var items = Order.all();
//    return _(items).reduce(function (sum, item) {
//        return sum + item.total();
//    }, 0);
//};
//
//Order.savePrice = function () {
//    var items = Order.all();
//    return _(items).reduce(function (sum, item) {
//        return sum + item.saving();
//    }, 0);
//};

module.exports = Order;
