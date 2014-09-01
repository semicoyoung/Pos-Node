
/*
 * GET users listing.
 */

exports.list = function(req, res){
    res.render('list', { list: [{type: '饮料', name: '雪碧', price: 3, unit: '瓶'}], title: '', cart: {count: 0}});
};