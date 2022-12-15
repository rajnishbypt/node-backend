const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors= require('cors')
require('dotenv/config');

// cors error
app.use(cors());
app.options('*',cors());
const api = process.env.API_URL;

// define port
const PORT = process.env.PORT || 4000;

// middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));

//  connection in mongodb database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connect to mongodb database successfully...');
  })
  .catch((err) => {
    console.log(err);
  });

//   routers
const productRouter = require('./routers/products');
const orderRouter = require('./routers/orders');
const userRouter = require('./routers/users');
const categoryRouter = require('./routers/categories');


app.use(`${api}/products`, productRouter);
app.use(`${api}/orders`, orderRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/categories`, categoryRouter);
 



// server running
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
