const fs = require('fs').promises
const path = require('path')

async function importProductData (db) {
  try {
    const dataPath = path.join(__dirname, './data/products.json')
    // Read JSON file
    const data = await fs.readFile(dataPath, 'utf-8')
    const products = JSON.parse(data)

    // Import products data (will also check for updates and update the db)
    for (const product of products) {
      // upsert based on product name
      // updatedProduct in case we need to log additional details or perform further actions
      const [updatedProduct, created] = await db.product.upsert({
        name: product.name,
        salePrice: parseFloat(product.salePrice.replace('$', '')),
        originalPrice: parseFloat(product.originalPrice.replace('$', '')),
        imageSrc: product.imageSrc,
        category: product.category,
        rating: product.rating,
        description: product.description
      }, {
        // unique constraint to match records for upsert
        conflictFields: ['name']
      })

      if (created) {
        console.log(`Product ${product.name} created.`)
      } else {
        console.log(`Product ${product.name} updated.`)
      }
    }
    console.log('Product data successfully imported or updated')
  } catch (error) {
    console.error('Error importing product data:', error)
  }
}

module.exports = importProductData
