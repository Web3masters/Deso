import { ethers } from "ethers";
import Contract from "../../contracts/build/contracts/ProfileImageFactory.json"

// const provider = new ethers.providers.InfuraProvider('rinkeby2', INFURA_API_KEY);

const prepare = (provider) => {
    const contractAddress = '0x02ed3576A9570e865A8efa23c4eb39e2A71E1bDF'
    const contractABI = Contract.abi;
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    return contract;
}

export default async function createUserContract(provider){

    const contract = prepare(provider)

    const signer = await provider.getSigner();
    
    const contractWithSigner = contract.connect(signer);

    try{
        console.log("creating contract")
        const transaction = await contractWithSigner.createUserPhoto(60)
        transaction.wait();
        console.log("finished")
        console.log(transaction)
        return transaction;
    } catch (e) {
        console.log(e)
        return null;
    }
}
//   writeContractVariable();