
'use strict';


var express = require('express');
var router = express.Router();


router.get('/list',function(req,res){

	console.log(req.query.language);

	res.send("hello world!");
		
});

/*router.get('/login/:name/:pass',function(req,res){
	res.json({
		user:{
			name:req.params.name,
			passWord:req.params.pass
		}
	});
});*/


/*router.get('/login',function(req,res){
	res.json({
		userName:'huan',
		passWord:'xxWdds'
	});
});
*/

module.exports = router;
