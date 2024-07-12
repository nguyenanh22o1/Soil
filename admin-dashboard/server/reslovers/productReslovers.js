const productResolvers = {
    Query: {
        products: async (parent, args, { db }) => {
            return await db.product.findAll();
        },
        product: async (parent, { id }, { db }) => {
            return await db.product.findByPk(id);
        },
    },
    Mutation: {
        createProduct: async (parent, { input }, { db }) => {
            return await db.product.create(input);
        },
        updateProduct: async (parent, { id, input }, { db }) => {
            const product = await db.product.findByPk(id);
            if (!product) {
                throw new Error('Product not found');
            }
            await product.update(input);
            return product;
        },
        deleteProduct: async (parent, { id }, { db }) => {
            const product = await db.product.findByPk(id);
            if (!product) {
                throw new Error('Product not found');
            }
            await product.destroy();
            return true;
        },
    },
};

module.exports = productResolvers;