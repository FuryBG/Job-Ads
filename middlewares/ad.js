const adService = require("../services/ad");

module.exports = () => {
    return (req, res, next) => {
        req.storage = {
            getAll: adService.getAll,
            getById: adService.getById,
            create: adService.create,
            edit: adService.edit,
            del: adService.del,
            addApply: adService.addApply
        };
        next();
    }
};