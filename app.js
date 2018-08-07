var express = require('express');
var app = express();
const bodyParser = require('body-parser');

var news = require('./app/news/NewsController');
var app_client = require('./app/app/AppController');
var team = require('./app/team/TeamController');
var comment = require('./app/comment/CommentController');

var apiRoutes = express.Router();
var db = require('./db');

// body parse
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

apiRoutes.use('/news', news);
apiRoutes.use('/app', app_client);
apiRoutes.use('/team', team);
apiRoutes.use('/comment', comment);

app.use('/football/api/v1', apiRoutes);
app.listen(3000, () => {
    console.log('Server running at port 3000');
    let result = db.connectToDb();
    if(result) {
        console.log('Connected DB');
    } else {
        console.log('Connected DB fail');
    }
})