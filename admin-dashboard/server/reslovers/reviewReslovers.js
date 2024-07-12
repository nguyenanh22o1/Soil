const reviewResolvers = {
    Query: {
        reviews: async (parent, args, { db }) => {
            return await db.review.findAll();
        },
        review: async (parent, { id }, { db }) => {
            return await db.review.findByPk(id);
        },
    },
    Mutation: {
        deleteReview: async (parent, { id }, { db }) => {
            const review = await db.review.findByPk(id);
            if (!review) {
                throw new Error('Review not found');
            }
            await review.update({ deletedByAdmin: true });
            return true;
        },
    },
    Review: {
        user: async (review, args, { db }) => {
            return await db.user.findByPk(review.userId);
        },
        product: async (review, args, { db }) => {
            return await db.product.findByPk(review.productId);
        },
    },
};

module.exports = reviewResolvers;