/*** @description - This function is used to initialise and restart the database at the initial run time  */
const initDatabase = () => {
    require("../../db/database");
};

module.exports = {
    initDatabase,
};