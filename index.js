const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');


//Order should be this way, model should be declared first and passport use auth taking mongoose.model from model
require('./models/User');
require('./services/passport');


//Mongoose connection
mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

if(process.env.NODE_ENV === 'production'){
    //expres wil serve up productoion assests
    //like out main.js file, or main.css
    app.use(express.static('client/build'));

        //Express will serve up the index.html file
        //if it doesnt recognize the route
    const path = require('path');
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client','build', 'index.html'));
    })
};



const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`The app is running on port of ${PORT}`);
});