
/*
 * GET home page.
 */
var fixtures = require('../models/fixtures');
var Item = require('../models/item');

exports.index = function(req, res){
    res.render('index', { title: 'Express' });
};

exports.list = function(req, res){
    res.render('list', {title: '', list: fixtures.items(), cart: {count: 0}});
};

exports.cart = function(req, res){
    res.render('cart', {title: '', list: fixtures.items(), cart: {count: 0, totalPrice: 9, savePrice: 3}})
};

exports.payment = function(req, res){
    res.render('payment', {title: '', list: fixtures.items(), cart: {count: 0, totalPrice: 9, savePrice: 3}})
};

exports.add = function(req, res){
    var name = req.body.name;
    var item = Item.findByName(name);
    //item.addCount();
    res.redirect('/list');
};
