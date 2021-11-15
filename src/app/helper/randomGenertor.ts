
const alphaNumeric = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

const randomAlphaNumeric = (length: number) => {

    let result = '';
    for (let i = length; i > 0; --i) result += alphaNumeric[Math.floor(Math.random() * alphaNumeric.length)];
    return result;
}


export { randomAlphaNumeric };
