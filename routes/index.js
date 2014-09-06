
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
    Order.all(function (err, list) {
        if(err) {
            req.flash('error', err);
        }
        var cartStats = Order.getCartStats(list);
        res.render('list', {
            title: '商品列表',
            list: fixtures.loadAllItems(),
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
        if(cartStats.count <= 0) {
            return res.redirect('/list');
        }
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
    Order.all(function (err, list) {
        if(err) {
            req.flash('error', err);
        }
        var cartStats = Order.getCartStats(list);
        var items = _(list).filter(function (record) {
            return record.count > 0;
        }).value();
        var free_items = _(items).filter(function (record) {
            return record.promotion && record.free() > 0;
        }).value();
        if(cartStats.count <= 0) {
            return res.redirect('/list');
        }
        res.render('payment', {
            title: '付款页',
            bought_list: items,
            free_list: free_items,
            count: cartStats.count,
            total: cartStats.total,
            saving: cartStats.saving
        });
    });
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
                result.store(function () {
                    res.redirect(req.url);
                });
            }
            else {
                result = _(fixtures.loadAllItems()).find({name: name});
                result.count++;
                result.getPromotion(fixtures.loadPromotions());
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

exports.clear = function (req, res){
    Order.clear(function (err) {
        if(err) {
            req.flash('error', err);
        }
        else {
            Order.clear();
            res.redirect('/list');
        }
    });
};
