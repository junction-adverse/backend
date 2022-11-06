require('dotenv').config();

const cors = require('cors');
const express = require("express");
const bodyParser = require('body-parser');
const streamr = require("./services/streamr");
const multer = require('multer');

const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    const endpoints = [
        {url: '/activeCampaigns', description: "All the current active campaigns in AdVerse"}
    ]
    res.send(endpoints);
});

app.listen(4000, () => {
    console.log("Running on port 4000.");
});

// Submit an ad from a creator to a campaign
app.post('/submitAd', multer().none(), async (req, res) => {
    // Get variables from frontend
    const { publicAddress, ytAPIKey, ytLink, campaignAddr, videoID } = req.body;

    // Add creator to data union
    await streamr.addCreator(campaignAddr, publicAddress)

    //TODO: Validate

    //TODO: YT Analytics

    if(campaignAddr === "0xf39c1cbc7f40a6dcf7456b7a827a373de09d3a42") {
        // Publish to nocco stream
        await streamr.publish('0x6a0ea2ea43f92ee1826b983e25a12364b7302f91/nocco', {
            ytLink: {ytLink},
        })
    } else if (campaignAddr === "0x639948759b9e6162f077d30bc519c5b32038cc3d") {
        // Publish to vitamin stream
        await streamr.publish('0x6a0ea2ea43f92ee1826b983e25a12364b7302f91/vitamin', {
            ytLink: {ytLink},
        })
    } else if (campaignAddr === "0x90e1240b967ac8fd9e647a64020c2b08e2639889") {
        // Publish to eigar stream
        await streamr.publish('0x6a0ea2ea43f92ee1826b983e25a12364b7302f91/Eigar', {
            ytLink: {ytLink},
        })
    }

    res.status(200).json({ test: { ytLink } });
})

// Get all of the active campaigns from advertisers
app.get('/activeCampaigns', async (req, res) => {

})

module.exports = app;
