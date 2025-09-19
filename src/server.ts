import createApp from "./app";
import config from "./config/config";

const app = createApp();

app.listen(config.port, () => {
    console.log(`Server running on port http://localhost:${config.port}`);
});