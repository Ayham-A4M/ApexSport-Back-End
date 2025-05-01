const express = require('express');
const app = express();
const routerUser = require('./src/routes/usersRoute');
const routerProduct = require('./src/routes/productsRoute');
const PORT = 8000;
const { default: mongoose } = require('mongoose');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const routerOrder = require('./src/routes/ordersRoute');
const routerStripe = require('./src/webhook/stripe_web_hook')
const routerAdmin=require('./src/routes/adminRoute');
const routerRefreshToken=require('./src/routes/refreshToken');

// CORS is enabled for the selected origins
const corsOptions = {
    origin: 'https://apex-sport.vercel.app/',  // Your frontend URL
    credentials: true,               // Allow cookies (JWT cookie) to be sent
};



mongoose.connect(process.env.DB_URI).then(() => {
    console.log("connected complete !!")
}).catch(err=>{
    console.log(err);
})
   

// End Connect with DB
// app.use(express.static('public'))
app.use(cors(corsOptions));
app.use(cookieParser());
app.use((req, res, next) => {
    if (req.originalUrl === '/stripe-webhook') {
        next();
    } else {
        express.json()(req, res, next);
    }
}); // its very important to make this middle ware in this form because when we use it with this form like this : app.use(express.json()) the  data in webhook will parse to json and we need it with string form to extract it succesfully
app.use(routerUser);
app.use(routerProduct);
app.use(routerOrder);
app.use(routerStripe)
app.use(routerAdmin)
app.use(routerRefreshToken);





app.listen(PORT, () => {
    console.log(`app listen now on port ${PORT}`);
})

