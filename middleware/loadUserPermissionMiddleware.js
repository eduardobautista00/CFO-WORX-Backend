
const { findByApiKey } = require('./authAPI');
module.exports = function loadDbPermission(request, res, next) {
    request.db = {
        users: {
            findByApiKey: async token => {
                try {
                    const user = await findByApiKey(token);
                    if (user) {
                        request.user = {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            roles: user.roles.map(role => ({
                                id: role.id,
                                name: role.role_name,
                                permissions: role.permissions.map(permission => permission.permission_name)
                            }))
                        };
                        return request.user;
                    } else {
                        return null;
                    }
                } catch (err) {
                    console.error("Error in findByApiKey:", err);
                    return res.sendStatus(403);
                }
            }
        }
    };
    next();
};

