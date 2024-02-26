const adminRoutes = require("../routes/v1/admin.routes");
const v1Routes = require("../routes/v1/index");

const routes = [
    {
        method: "use",
        url: "/v1",
        handler: v1Routes,
    },
    {
        method: "use",
        url: "/admin",
        handler: adminRoutes,
    },
];

/**
 * @description - This function is used to initialise the main app routing endpoints
 * @param {import("express").Application} app
 */

const initRoutes = ({ app }) => {
    routes.forEach((route) => {
        app[route.method](route.url, route.handler);
    });
};

module.exports = {
    initRoutes,
};