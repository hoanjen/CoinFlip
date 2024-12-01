import app from './app';
import config from './config/config';
import connect from './config/database';
declare global {
    interface BigInt {
        toJSON(): string;
    }
}

BigInt.prototype.toJSON = function () {
    return this.toString();
};
connect();

app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
});
