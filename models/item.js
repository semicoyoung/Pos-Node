var Order = require('./order');
var _ = require('lodash');
var mongodb = require('./db');

function Item(barcode, name, unit, price, type, count, promotion) {
    this.barcode = barcode;
    this.name = name;
    this.unit = unit;
    this.price = price;
    this.type = type;
    this.count = count || 1;
    this.promotion = promotion || false;
}

Item.prototype.storage = function () {
    var item = this;

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
            collection.findOne({barcode: item.barcode}, function (err, result) {
                if (!result) {
                    collection.insert(item, {
                        safe: true
                    }, function (err) {
                        mongodb.close();
                    });
                    mongodb.close();
                    return;//失败！返回 err 信息
                }
                collection.update({barcode: item.barcode}, item, {
                    safe: true
                }, function (err) {
                    mongodb.close();
                });
            });
        });
    });
};

Item.prototype.getPromotion = function () {
    this.promotion = true;
    this.storage();
};

Item.prototype.addCount = function() {
    this.count++;
    this.storage();
};

Item.prototype.minusCount = function () {
    if(this.count <= 0) {
        return;
    }
    this.count--;
    this.storage();
};

Item.prototype.sumDisplay = function () {
    var extraSum = this.free() > 0? ' (原价：' + this.total() + '元)': '';
    return this.fare() + '元' + extraSum;
};

Item.prototype.free = function () {
    return this.promotion? Math.floor(this.count / 3): 0;
};

Item.prototype.total = function () {
    return this.count * this.price;
};

Item.prototype.fare = function () {
    return (this.count - this.free()) * this.price;
};

Item.prototype.save = function () {
    return this.free() * this.price;
};

module.exports = Item;
