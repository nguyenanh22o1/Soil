const { Sequelize, DataTypes } = require('sequelize')
const config = require('./config.js')
// const importProductData = require('./importProductData')

const db = {
  Op: Sequelize.Op
}

// Create Sequelize.
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT
})

// Include models.
db.user = require('./models/user.js')(db.sequelize, DataTypes)
db.product = require('./models/product.js')(db.sequelize, DataTypes)
// db.cart = require('./models/cart.js')(db.sequelize, DataTypes)
// db.cartItem = require('./models/cartItem.js')(db.sequelize, DataTypes)
// db.order = require('./models/order.js')(db.sequelize, DataTypes)
// db.orderDetails = require('./models/orderDetails.js')(db.sequelize, DataTypes)
db.review = require('./models/review.js')(db.sequelize, DataTypes)

// Call the associate function for each model
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

// Include a sync option with seed data logic included.
db.sync = async () => {
  // Sync schema.
  await db.sequelize.sync()

  // sync with force if the schema has become out of date - note that syncing with force is a destructive operation.
  // await db.sequelize.sync({ force: true });
  // await seedData();

  // Import product data after syncing
  // await importProductData(db)
}

db.sync().then(() => {
  console.log('Database synced and product data imported')
}).catch(error => {
  console.error('Error syncing database:', error)
})

module.exports = db
