const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const  methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');
const rootRouter = require('./router/rootRouter');
const membersRouter = require('./router/membersArea');
const membersAdmin = require('./router/membersAdmin');
const postRouter = require('./router/postRouter');
const PORT = 9000;



// App Setup
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(session({
    genid: (req) => {
        return uuidv4()
    },
    secret: 'Dont Tell Anyone!',
    resave: false,
    saveUninitialized: true,
    name: 'sessionID'
}));



// User routes
app.use('/', rootRouter);
app.use('/members', membersRouter);
app.use('/members/admin', membersAdmin);
app.use('/api', postRouter);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

