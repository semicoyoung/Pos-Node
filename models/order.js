var _ = require('lodash');
var fixtures = require('./fixtures');

function Order () {
}

Order.all = function () {

    var boughtItems = {};
    var result = {};
    _(boughtItems).each(function (item, barcode) {
        result[barcode] = new Item(item.barcode, item.name, item.unit, item.price, item.type, item.count, item.promotion);
    });

    return result;
};

Order.getCount = function () {
    return _(Order.all()).reduce(function (sum, item) {
        return sum + item.count;
    }, 0);
};

Order.clear = function () {
    localStorage.boughtItems = JSON.stringify({});
};

Order.addItem = function (name) {
    var item = _(Order.all()).find({name: name}) || _(fixtures.loadAllItems()).find({name: name});
    item.addCount();
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
