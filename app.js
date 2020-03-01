const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session')
var methodOverride = require('method-override')

const rootRouter = require('./router/rootRouter');
const membersRouter = require('./router/membersArea');
const postRouter = require('./router/postRouter');


const PORT = 9000;



// App Setup
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(methodOverride('_method'));

// User routes
app.use('/', rootRouter);
app.use('/members', membersRouter);
app.use('/api', postRouter);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

