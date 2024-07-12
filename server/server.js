const express = require('express')
const cors = require('cors')
const db = require('./database')

// route
const authRoute = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const userRoute = require('./routes/userRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const reviewRoute = require('./routes/reviewRoutes')

// Database will be sync'ed in the background.
db.sync()

const app = express()
// Parse requests of content-type - application/json.
app.use(express.json())
// Add CORS suport.
app.use(cors())
// request va respond under jason format
app.use(express.json())

// Add routes.
app.use('/v1/auth', authRoute)
app.use('/v1/products', productRoutes)
app.use('/v1/user', userRoute)
app.use('/v1/cart', cartRoutes)
app.use('/v1/order', orderRoutes)
app.use('/v1/reviews', reviewRoute)
// require("./src/routes/post.routes.js")(express, app)

// Set port, listen for requests.
const PORT = 8000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
