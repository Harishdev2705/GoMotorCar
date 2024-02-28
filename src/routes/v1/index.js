const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes.js")
//---------- Admin --------------------------------

const adminUserRoutes = require("./admin/user.routes.js")
const adminAuthRoutes = require("./admin/auth.routes.js")
const admincarRoutes = require("./admin/car.routes.js")
const adminPolicyRoutes = require("./admin/policy.routes.js")
const adminHelpRoutes = require("./admin/help.routes.js")



//---------- Business -----------------------------
const businessAuthRoutes = require("./business/auth.routes.js")
// const businessHomeRoutes = require("./business/home.routes.js")



//----------------- User ----------------------------
const userRoutes = require("./user/user.routes.js")
const BuserRoutes = require("./user/businessUser.routes.js")

const routes = [
    {
        method: "use",
        url: "/admin/auth",
        handler: adminAuthRoutes,
    },
    {
        method: "use",
        url: "/admin/car",
        handler: admincarRoutes,
    },
    {
        method: "use",
        url: "/admin/user",
        handler: adminUserRoutes,
    },
    {
        method: "use",
        url: "/admin/policy",
        handler: adminPolicyRoutes
    },
    {
        method: "use",
        url: "/admin/help",
        handler: adminHelpRoutes
    },
    {
        method: "use",
        url: "/auth",
        handler: authRoutes,
    },
    {
        method: "use",
        url: "/user",
        handler: userRoutes,
    },
    {
        method: "use",
        url: "/buser",
        handler: BuserRoutes,
    },    
    {
        method: "use",
        url: "/auth/",
        handler: businessAuthRoutes,
    },
    // {
    //     method: "use",
    //     url: "/business/home",
    //     handler: businessHomeRoutes,
    // },
];

router.get("/status", (req, res) => res.send("OK"));

(function () {
    routes.forEach((route) => {
        router[route.method](route.url, route.handler);
    });
})();


module.exports = router;