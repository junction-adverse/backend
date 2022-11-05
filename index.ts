require('dotenv').config();

const cors = require('cors');
const express = require("express");
const bodyParser = require('body-parser');
const streamr = require("../services/streamr");

const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    const endpoints = [
        {url: '/audiences', description: "This returns the list of audiences or classifications"},
        {url: '/audiences/check-volume', description: "This returns the size of the specific keywords"},
        {url: '/messages/', description: "This is the endpoint to receive messages from address"},
        {url: '/messages/', description: "This is the endpoint to receive messages from address"},
    ]
    res.send(endpoints);
});

app.listen(3000, () => {
    console.log("Running on port 3000.");
});

const router = express.Router()

// Submit an ad from a creator to a campaign
router.post('/submitAd', async (req, res) => {
    // Get variables from frontend
    const { publicAddress, ytAPIKey, ytLink, campaignAddr, videoID } = req.body;

    // Add creator to data union
    await streamr.addMember(campaignAddr, publicAddress)
})

// Get all of the active campaigns from advertisers
router.ger('/activeCampaigns', async (req, res) => {

})

module.exports = app;
