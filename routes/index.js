
/*
 * GET home page.
 */
var fixtures = require('../models/fixtures');
var Item = require('../models/item');
var Order = require('../models/order');

exports.index = function(req, res){
    res.render('index', {
        title: '主页',
        count: Order.getCount()
    });
};

exports.list = function(req, res){
    res.render('list', {
        title: '商品列表',
        list: fixtures.items(),
        count: Order.getCount()
    });
};

exports.cart = function(req, res){
    res.render('cart', {
        title: '购物车',
        count: Order.getCount(),
        items: Order.all(),
        totalPrice: Order.totalPrice(),
        savePrice: Order.savePrice()
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
    var item = Item.findByName(name);
    //item.addCount();
    res.redirect('/list');
};
