const DataUnionClient = require('@dataunions/client').DataUnionClient
const StreamrClient = require('streamr-client')

const PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;
const PUBLIC_KEY = process.env.ADMIN_ADDRESS;

const dataUnionClient = new DataUnionClient({
    auth: {
        privateKey: PRIVATE_KEY,
    },
    chain: 'polygon',
});

const streamr = new StreamrClient({
    auth: {
        privateKey: PRIVATE_KEY
    }
})

const publish = async (endpoint, data) => {
    const res = streamr.publish(endpoint, data);
    return res
}

const createCampaign = async (name, description = "") => {

    const deploymentOptions = {
        owner: PUBLIC_KEY,
        joinPartAgents: [PUBLIC_KEY],
        dataUnionName: name,
        adminFee: 0.1,
        metadata: {
            "information": description,
        }
    }

    const dataUnion = await dataUnionClient.deployDataUnion(
        deploymentOptions
    );

    console.log("Ad campaign contract address is : "+ name + " : ", dataUnion.getAddress())

    return dataUnion
}

const addCreator = async (campaignAddress, creatorAddress) => {

    const dataUnion = await dataUnionClient.getDataUnion(campaignAddress);

    const isMember = await dataUnion.isMember(creatorAddress)

    if (!isMember) {
        const tx = await dataUnion.addMembers([creatorAddress]);
        console.log("Member added!")
        console.log("Data union:", await dataUnion.getActiveMemberCount())
    } else {
        console.log("Member already exists in dataUnion!")
        console.log("Data union:", await dataUnion.getActiveMemberCount())
    }
}

const refreshRevenue = async (campaignAddress) => {
    const dataUnion = await dataUnionClient.getDataUnion(campaignAddress);
    await dataUnion.refreshRevenue()
    console.log("Revenue refreshed!")
}

exports.createCampaign = createCampaign;
exports.addCreator = addCreator;
exports.refreshRevenue = refreshRevenue;
exports.publish = publish;