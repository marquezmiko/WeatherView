var express = require('express');
var router = express.Router();

/* GET cityList. */
router.get('/cityList', function(req, res) {
    var db = req.db;
    var collection = db.get('cityList');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});


/* POST to addCity */
router.post('/addCity', function(req, res) {
    var db = req.db;
    var collection = db.get('cityList');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/* DELETE to deleteCity */
router.delete('/deleteCity/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('cityList');
    var cityToDelete = req.params.id;
    collection.remove({ '_id' : cityToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;