const express = require('express');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
app.use(express.json());

// 🔐 KEY MOMO SANDBOX (dán key của bạn vào)
const partnerCode = "YOUR_PARTNER_CODE";
const accessKey = "YOUR_ACCESS_KEY";
const secretKey = "YOUR_SECRET_KEY";

// 🚀 API tạo thanh toán
app.get('/pay', async (req, res) => {
    const requestId = Date.now().toString();
    const orderId = requestId;

    const rawSignature =
        `accessKey=${accessKey}&amount=10000&extraData=&ipnUrl=https://yourdomain.com/api/momo/ipn&orderId=${orderId}&orderInfo=Nap TLBB&partnerCode=${partnerCode}&redirectUrl=https://yourdomain.com/return&requestId=${requestId}&requestType=captureWallet`;

    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const body = {
        partnerCode,
        accessKey,
        requestId,
        amount: "10000",
        orderId,
        orderInfo: "Nap TLBB",
        redirectUrl: "https://yourdomain.com/return",
        ipnUrl: "https://yourdomain.com/api/momo/ipn",
        requestType: "captureWallet",
        signature,
        extraData: ""
    };

    const response = await axios.post(
        "https://test-payment.momo.vn/v2/gateway/api/create",
        body
    );

    res.json(response.data);
});

// 🔥 CALLBACK MOMO
app.post('/api/momo/ipn', (req, res) => {
    const data = req.body;

    console.log("MOMO CALLBACK:", data);

    if (data.resultCode == 0) {
        console.log("Thanh toán thành công");

        // 👉 TODO: cộng KNB ở đây
    }

    res.status(204).send();
});

app.listen(3000, () => {
    console.log("Server chạy tại port 3000");
});
