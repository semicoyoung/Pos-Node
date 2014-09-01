
/*
 * GET users listing.
 */
var fixtures = require('../models/fixtures');

exports.list = function(req, res){
    res.render('list', {title: '', list: fixtures.items(), cart: {count: 0}});
};