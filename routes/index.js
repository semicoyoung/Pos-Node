
/*
 * GET home page.
 */
var fixtures = require('../models/fixtures');
var Order = require('../models/order');

exports.index = function(req, res){
    Order.getCartStats(function (err, count) {
        if(err) {
            req.flash('error', err);
        }
        res.render('index', {
            title: '主页',
            count: count
        });
    });
};

exports.list = function(req, res){
    res.render('list', {
        title: '商品列表',
        list: fixtures.loadAllItems(),
        count: Order.getCartStats()
    });
};

exports.cart = function(req, res){
    res.render('cart', {
        title: '购物车',
        count: Order.getCartStats(),
        items: {},
        totalPrice: 0,
        savePrice: 0
    })
};

exports.payment = function(req, res){
    res.render('payment', {
        title: '付款页',
        list: fixtures.items(),
        cart: {count: 0, totalPrice: 9, savePrice: 3}
    })
};

exports.add = function(req, res){
    var name = req.body.name;
    Order.getItem(name, function (err, result) {
        if(err) {
            req.flash('error', err);
        }
        else {
            if(result) {
                result.count++;
                result.store();
            }
            else {
                result = _(fixtures.loadAllItems()).find({name: name});
                result.count++;
                result.join();
            }
        }
        res.redirect('/list');
    });
};
