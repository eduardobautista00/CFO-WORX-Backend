
const { User, Role, Permission } = require('../models');

async function findByApiKey(id) {
    try {
        const user = await User.findOne({
            include: [{
                model: Role,
                include: [{
                    model: Permission
                }]
            }],
            where: { id: id }
        });

        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (err) {
        console.error('Error in findByApiKey:', err.message);
    }
}

module.exports = { findByApiKey };
