const userResolvers = {
    Query: {
        users: async (parent, args, { db }) => {
            return await db.user.findAll();
        },
        user: async (parent, { id }, { db }) => {
            return await db.user.findByPk(id);
        },
    },
    Mutation: {
        blockUser: async (parent, { id }, { db }) => {
            const user = await db.user.findByPk(id);
            if (!user) {
                throw new Error('User not found');
            }
            user.isBlocked = true;
            await user.save();
            return user;
        },
        unblockUser: async (parent, { id }, { db }) => {
            const user = await db.user.findByPk(id);
            if (!user) {
                throw new Error('User not found');
            }
            user.isBlocked = false;
            await user.save();
            return user;
        },
    },
};

module.exports = userResolvers;