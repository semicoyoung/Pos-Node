var _ = require('lodash');
var fixtures = require('./fixtures');
var mongodb = require('./db');

function Order () {
}

Order.getCount = function () {
    return 0;
};

Order.clear = function () {
    localStorage.boughtItems = JSON.stringify({});
};

Order.addItem = function (name) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 items 集合
        db.collection('items', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将用户数据插入 users 集合
            collection.findOne({name: name}, function (err, result) {
                if (!result) {
                    collection.insert(_(fixtures.loadAllItems()).find({name: name}), {
                        safe: true
                    }, function (err) {
                        mongodb.close();
                    });
                    mongodb.close();
                    return;
                }
                result.count++;
                collection.update({name: name}, result, {
                    safe: true
                }, function (err) {
                    mongodb.close();
                });
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

Order.totalPrice = function () {
    var items = Order.all();
    return _(items).reduce(function (sum, item) {
        return sum + item.total();
    }, 0);
};

Order.savePrice = function () {
    var items = Order.all();
    return _(items).reduce(function (sum, item) {
        return sum + item.save();
    }, 0);
};

module.exports = Order;
