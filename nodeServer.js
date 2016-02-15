/**
 * Created by huan.li on 2015/3/17.
 */

var app = require('./server/main');

var server = app.listen(4000,function(){
  console.log('angularDemo App is listening on %d',server.address().port);
})
