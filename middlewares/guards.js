function isUser() {
    return (req, res, next) => {
        if(req.user) {
            next();
        }else {
            res.redirect("/auth/login");
        }
    };
}

function isGuest() {
    return (req, res, next) => {
        if(!req.user) {
            next();
        }else {
            res.redirect("/");
        }
    };
}

function isOwner() {
    return async(req, res, next) => {
        try{
        let currItem = await req.storage.getById(req.params.id);
        if(currItem.owner._id == req.user._id) {
            next();
        }else {
            res.redirect("/");
        }
    }catch(err) {
        res.redirect("/notfound");
    };
    };
};

function isNotOwnerAndNotApply() {
    return async(req, res, next) => {
        try {
        let currItem = await req.storage.getById(req.params.id);
        let applyFind = currItem.subscribed.find(x => x._id == req.user._id);
        if(currItem.owner._id != req.user._id && !applyFind) {
            next();
        }else {
            res.redirect("/");
        };
    }catch(err) {
        res.redirect("/notfound");
    }
    };
};

module.exports = {
    isUser,
    isGuest,
    isOwner,
    isNotOwnerAndNotApply
};