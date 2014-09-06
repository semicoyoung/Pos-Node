
/*
 * GET home page.
 */
var fixtures = require('../models/fixtures');
var Order = require('../models/order');
var _ = require('lodash');

exports.index = function(req, res){
    Order.all(function (err, list) {
        if(err) {
            req.flash('error', err);
        }
        var cartStats = Order.getCartStats(list);
        res.render('index', {
            title: '主页',
            count: cartStats.count
        });
    });
};

exports.list = function(req, res){
    var items = fixtures.loadAllItems();
    Order.all(function (err, list) {
        if(err) {
            req.flash('error', err);
        }
        var cartStats = Order.getCartStats(list);
        res.render('list', {
            title: '商品列表',
            list: items,
            count: cartStats.count
        });
    });
};

exports.cart = function(req, res){
    Order.all(function (err, list) {
        if(err) {
            req.flash('error', err);
        }
        var cartStats = Order.getCartStats(list);
        var items = _(list).filter(function (record) {
            return record.count > 0;
        }).value();
        res.render('cart', {
            title: '购物车',
            items: items,
            count: cartStats.count,
            total: cartStats.total,
            saving: cartStats.saving
        });
    });
};

exports.payment = function(req, res){
    res.render('payment', {
        title: '付款页',
        list: [],
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
                result.getPromotion(fixtures.loadPromotions());
                result.store(function () {
                    res.redirect(req.url);
                });
            }
            else {
                result = _(fixtures.loadAllItems()).find({name: name});
                result.count++;
                result.join(function () {
                    res.redirect(req.url);
                });
            }
        }
    });
};

exports.alter = function (req, res){
    var name = req.body.name;
    var operation = req.body.operation;
    Order.getItem(name, function (err, result) {
        if(err) {
            req.flash('error', err);
        }
        else {
            if(result && operation == 'add') {
                result.count++;
                result.store(function () {
                    res.redirect(req.url);
                });
            }
            else if(result) {
                if(result.count > 0) {
                    result.count--;
                }
                result.store(function () {
                    res.redirect(req.url);
                });
            }
        }
    });
};
