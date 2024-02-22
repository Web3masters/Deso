import { ethers } from "ethers";
import Contract from "../../contracts/build/contracts/Donation.json"

// const provider = new ethers.providers.InfuraProvider('rinkeby2', INFURA_API_KEY);

const prepare = (provider) => {
    const contractAddress = '0x2F533eB919E4B9013AacF11B9853F24484965dE1';
    const contractABI = Contract.abi;
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    return [contract, contractAddress, contractABI];
}

function readDataFeed(contract) {
    const res = contract.getPriceData()
    return res
}


function convertRating(usdInput, ethwei) {
    const convertedData = ethwei / 10000000000000000n;
    const usdToEth = usdInput / Number(convertedData);
    return usdToEth;
}

export default async function donateAmount(provider, recipient, usdAmount){

    console.log(`Recipient: ${recipient} | Amount: ${usdAmount}`)

    const [contract, contractAddress, contractABI] = prepare(provider)

    console.log("getting signer")
    const signer = await provider.getSigner();
    
    console.log("getting contract w. signer")
    const contractWithSigner = contract.connect(signer);
    
    console.log("reading data feed")
    const oracleEth = await readDataFeed(contract);
    console.log("data feed read", oracleEth)

    if (!oracleEth) return "Oracle Error";

    console.log("converting rating")
    const usdToEth = convertRating(usdAmount, oracleEth);
    console.log("converted!", usdToEth)
    
    const options = {value: ethers.parseEther(usdToEth.toString())}
    
    console.log("Making transaction")
    try{
        const transaction = await contractWithSigner.transferFunds(recipient, options)
        transaction.wait();
        console.log("finished")
        return "OK";
    } catch (e) {
        console.log(e)
        return "Transaction Error";
    }
}
//   writeContractVariable();