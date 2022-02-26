const router = require("express").Router();
const { isGuest, isUser } = require("../middlewares/guards");

    router.get("/register", isGuest(), (req, res) => {
        res.render("register.hbs");
    });

    router.post("/register", isGuest(), async(req, res) => {
        try{
            let errors = [];
            let emailRegEx = /[A-Za-z]+@[A-Z-a-z]+\.[A-Za-z]+/;
            if(!req.body.email.match(emailRegEx)) {
                errors.push("Invalid email!");
            };
            if(req.body.password.length < 5) {
                errors.push("Password is too short!");
            };
            if(req.body.password != req.body.rePass) {
                errors.push("Passwords must match!");
            };
            if(req.body.skills.length > 40) {
                errors.push("Skills is too long!");
            };
            if(req.body.skills.length <= 0) {
                errors.push("Skills is required!");
            };
            if(errors.length > 0) {
                throw new Error(errors.join("\n"));
            }
            await req.auth.register(req.body.email, req.body.password, req.body.skills);
        res.redirect("/");
        }catch(err) {
            console.log(err);
            res.render("register.hbs", {errors: err.message.split("\n")});
        }
    });

    router.get("/login", isGuest(), (req, res) => {
        res.render("login.hbs");
    });

    router.post("/login", isGuest(), async(req, res) => {
        try{
            await req.auth.login(req.body.email, req.body.password);
        res.redirect("/");
        }catch(err) {
            res.render("login.hbs", {errors: err.message.split("\n")});
        }
    });


    router.get("/logout", isUser(), (req, res) => {
        req.auth.logout();
        res.redirect("/");
    });


module.exports = router;