// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { Twilio } = require('twilio');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const accountSid =  process.env.ASID;
const authToken = process.env.AT;
const verifySid = process.env.VSID;

const client = new Twilio(accountSid, authToken);

// Send OTP
app.post('/send-otp', async (req, res) => {
    console.log("OTP request recived");
    
    const { phone } = req.body;
    try {
        const verification = await client.verify.services(verifySid)
            .verifications.create({ to: `+91${phone}`, channel: 'sms' });
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Verify OTP
app.post('/verify-otp', async (req, res) => {
    console.log("OTP verify request recived");
    
    const { phone, code } = req.body;
    try {
        const verificationCheck = await client.verify.services(verifySid)
            .verificationChecks.create({ to: `+91${phone}`, code });
        res.json({ success: verificationCheck.status === "approved" });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));