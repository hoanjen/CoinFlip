import app from './app';
import config from './config/config';
import connect from './config/database';
connect();

app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
});
