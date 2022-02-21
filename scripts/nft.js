const { task } = require( "hardhat/config");

task("DeployNFT", "")
    .addParam("name", "Name of the Nft")
	.addParam("symbol", "Symbol of the Nft")
	.addParam("baseuri", "Base URI")
	.setAction(async (taskArgs, hre) => {
        const contract = await hre.ethers.getContractFactory("MintNFT");
        const deployed = await contract.deploy(taskArgs.name, taskArgs.symbol, taskArgs.baseuri);

        await deployed.deployed();

        console.log(`Deployed to: ${deployed.address}`);
    });

