const pick = <T, K extends keyof T>(object: T, keys: K[]): Partial<T> => {
    return keys.reduce((obj: Partial<T>, key: K) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            obj[key] = object[key];
        }
        return obj;
    }, {});
};

export default pick;
