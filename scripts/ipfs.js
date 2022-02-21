const { create, IPFSHTTPClient } = require('ipfs-http-client');
const fs = require('fs');

function createIpfsClient() {
    const auth = 'Basic ' + Buffer.from(process.env.IPFS_PROJECTID + ':' + process.env.IPFS_SECRET).toString('base64')
    const remoteClient = create( { 
        url: "https://ipfs.infura.io:5001/api/v0",
        headers: { authorization: auth } 
    });

    return remoteClient;
}
//URI:https://ipfs.infura.io/ipfs/QmNf49dzrMMabpgpsD2i4d6iymjMmZ8C7UQTNXeaq3er4A/ugurhan.jpg
//JSON : https://ipfs.infura.io/ipfs/QmcM7aDTCytw4JTZddrtVznEiAQKWgWNZdnNbXqYf45Rjn/metadata.json


//Run to upload image to Infura and obtain IPFS

const ipfsGatewayUrl = "https://ipfs.infura.io/ipfs";
task("UploadImage", "")
    .addParam("fullpath","Image Path")
	.setAction(async (taskArgs) => {
        const ipfsClient = createIpfsClient();
        //const version = await ipfsClient.version()
        //const fileName= "ugurhan.jpg"
        //const file = fs.readFileSync(`./nft/${fileName}`)

        const fileName = taskArgs.fullpath.replace(/^.*[\\\/]/, '')
        const file = fs.readFileSync(taskArgs.fullpath);

        //command npx hardhat UploadImage --fullpath nft/solar.png

        const { cid: metadataCid } = await ipfsClient.add({ 
            path: `/nft/${fileName}`, 
            content: file
        })
        //console.log(`IPFS version:${version.version} `);
        console.log(`Uploaded Image URI:${ipfsGatewayUrl}/${metadataCid}/${fileName} `);

    });


class Metadata {
    constructor(imageURI,metaName,desc)
    {
        this.image = imageURI,
        this.name = metaName,
        this.description = desc
    }

}
    
//Run to obtain metadata.json 
task("UploadMetadata", "")
    .addParam("imageuri", "Image URI")
    .addParam("name", "NFT name")
    .addParam("desc", "Description")
	.setAction(async (taskArgs) => {
        const ipfsClient = createIpfsClient();

        const metadata = new Metadata(taskArgs.imguri,taskArgs.name,taskArgs.desc);
        const metadataJson = JSON.stringify(metadata);

        //command npx hardhat UploadMetadata --name Ugurhan --desc "My digital identity" --imageuri https://ipfs.infura.io/ipfs/QmNf49dzrMMabpgpsD2i4d6iymjMmZ8C7UQTNXeaq3er4A/ugurhan.jpg

        const { cid: metadataCid } = await ipfsClient.add({ 
            path: `/nft/metadata.json`,     
            content: metadataJson
        });
        console.log(`Uploaded image uri: ${ipfsGatewayUrl}/${metadataCid}/metadata.json`);
    });