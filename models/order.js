var _ = require('lodash');
var mongodb = require('./db');
var Item = require('./item');

function Order () {
}

Order.all = function (callback) {
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
                callback(null, result);
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

Order.getCartStats = function (list) {
    var count = 0, total = 0, saving = 0;
    _(list).each(function (stat) {
        var item = new Item(stat.barcode, stat.name, stat.unit, stat.price, stat.type, stat.count, stat.promotion);
        count += item.count;
        total += item.total();
        saving += item.saving();
    });
    return { count: count, total: total, saving: saving };
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

module.exports = Order;
