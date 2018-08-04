var express = require('express');
var app = express();
var news = require('./app/news/NewsController');
var app_client = require('./app/app/AppController');
var team = require('./app/team/TeamController');

var apiRoutes = express.Router();
var db = require('./db');

apiRoutes.use('/news', news);
apiRoutes.use('/app', app_client);
apiRoutes.use('/team', team);

app.use('/football/api/v1', apiRoutes);
app.listen(3000, () => {
    console.log('Server running at port 3000');
    let result = db.connectToDb();
    if(result) {
        console.log('Connected DB 123s');
    } else {
        console.log('Connected DB fail');
    }
})