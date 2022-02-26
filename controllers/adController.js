const router = require("express").Router();
const { isUser, isOwner, isNotOwnerAndNotApply, isGuest } = require("../middlewares/guards");

router.get("/", async(req, res) => {
    let allAds = await req.storage.getAll();
    allAds = allAds.reverse().slice(0, 3);
    allAds.forEach(x => x.candidatesNumber = x.subscribed.length);
    res.render("home.hbs", {allAds});
});

router.get("/search", (req, res) => {
    res.render("search.hbs");
});

router.post("/search", isUser(), async(req, res) => {
    let allItems = await req.storage.getAll();
    if(req.body.email != "") {
    let allMatch = [];

    allItems.forEach(x => {
        if(x.owner.email.toLowerCase() == req.body.email.toLowerCase()) {
            allMatch.push(x);
        };
    });
    if(allMatch.length > 0) {
        res.render("search.hbs", {allMatch});
    }else {
        res.render("search.hbs", {allMatch: true});
    }
}else {
    res.render("search.hbs");
}

});

router.get("/all", async(req, res) => {
    let allAds = await req.storage.getAll();
    res.render("all-ads.hbs", {allAds});
});

router.get("/delete/:id", isUser(), isOwner(), async(req, res) => {
    try {
        await req.storage.del(req.params.id);
        res.redirect("/all");
    }catch(err) {
        res.redirect("/notfound");
    };
});

router.get("/apply/:id", isUser(), isNotOwnerAndNotApply(), async(req, res) => {
    try{
    await req.storage.addApply(req.params.id, req.user._id);
    res.redirect(`/details/${req.params.id}`);
    }catch(err) {
        res.redirect("/notfound");
    };
});

router.post("/edit/:id", isUser(), isOwner(), async(req, res) => {
    try {
        let errors = [];
        if(req.body.head.length < 4) {
            errors.push("Head is too short!");
        };
        if(req.body.location.length < 8) {
            errors.push("Location is too short!");
        };
        if(req.body.name.length < 3) {
            errors.push("Name is too short!");
        };
        if(req.body.description.length > 40) {
            errors.push("Description is too long!");
        };
        if(req.body.description.length == 0) {
            errors.push("Description is required!");
        };
        if(errors.length > 0) {
            throw new Error(errors.join("\n"));
        }
        await req.storage.edit(req.params.id, req.body);
        res.redirect(`/details/${req.params.id}`);
    }catch(err) {
        res.render("edit.hbs", { currItem:req.body, errors: err.message.split("\n")});
    };
});

router.get("/edit/:id", isUser(), isOwner(), async(req ,res) => {
    try {
    let currItem = await req.storage.getById(req.params.id);
    res.render("edit.hbs", {currItem});
    }catch(err) {
        res.redirect("/notfound");
    };
});

router.get("/details/:id", async(req, res) => {
    try {
        let currentAd = await req.storage.getById(req.params.id);

        currentAd.ownerName = currentAd.owner.email;
        currentAd.applyNumber = currentAd.subscribed.length;
        if(req.user) {
            if(req.user._id == currentAd.owner._id) {
                currentAd.isOwner = true;
            };
            let findApply = currentAd.subscribed.find(x => x._id == req.user._id);
            if(findApply) {
                currentAd.isApply = true;
            };
        };
        if(currentAd.isOwner == true && currentAd.subscribed.length > 0) {
            currentAd.showSubs = true;
        };
        res.render("details.hbs", currentAd);
    }catch(err) {
        res.redirect("/notfound");
    };
});

router.get("/create", isUser(), (req, res) => {
    res.render("create.hbs");
});

router.post("/create", isUser(), async(req, res) => {
    try{
        let errors = [];
        if(req.body.head.length < 4) {
            errors.push("Head is too short!");
        };
        if(req.body.location.length < 8) {
            errors.push("Location is too short!");
        };
        if(req.body.name.length < 3) {
            errors.push("Name is too short!");
        };
        if(req.body.description.length > 40) {
            errors.push("Description is too long!");
        };
        if(req.body.description.length == 0) {
            errors.push("Description is required!");
        };
        if(errors.length > 0) {
            throw new Error(errors.join("\n"));
        }
        req.body.owner = req.user._id;
        let newAd = await req.storage.create(req.body);
        await req.auth.added(req.user._id, newAd._id);
        res.redirect("/all");
    }catch(err) {
        res.render("create.hbs", {errors: err.message.split("\n")});
    }
});

router.all("*", (req, res) => {
    res.render("404.hbs");
});




module.exports = router;