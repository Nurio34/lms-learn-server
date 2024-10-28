const Iyzipay = require("iyzipay");

const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_API_SECRET,
    uri: process.env.IYZICO_SANDBOX_URL,
});

module.exports = { iyzipay, Iyzipay };
