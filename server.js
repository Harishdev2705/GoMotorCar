const app = require("./app");
const { port, serverUrl } = require("./src/utility/config");
const PORT = port || 6502;


app.listen(PORT, () => {
    console.log(`App listening on ${serverUrl}:${PORT}`);
    logger.info(`App listening on ${serverUrl}:${PORT}`);
});