var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('about', { message: 'We made it fam' });
});

router.get('/me', function(req, res) {
	res.send('About me');
});

module.exports = router;