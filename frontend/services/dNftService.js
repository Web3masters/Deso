import { ethers } from "ethers";
import axios from "axios";
//import Contract from "../../contracts/build/contracts/ProfilImage.json"

const prepareContract = (provider, contractAddress) => {
    const contractABI = Contract.abi;
    const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
    );
    return contract;
};

//gets the number of images the user already had, to give an ID to the new one
const getImagesCounter = async (contract) => {
    const counter = await contract.getCounter();
    return counter;
};

const sendFileToIPFS = async (file, counter) => {
    counter++;

    if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
            method: "post",
            url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
            data: formData,
            headers: {
                pinata_api_key: "bf67cf4376213d9d9cb0", // `${process.env.REACT_APP_PINATA_API_KEY}`,
                pinata_secret_api_key:
                    "5250eddb652c2e750bdf57d8ed79ee762564fed74c4ebfd78bb35dd4dbbe5a17", // `${process.env.REACT_APP_PINATA_API_SECRET}`,
                "Content-Type": "multipart/form-data",
            },
        });

        const fileHash = `https://ipfs.io/ipfs/${resFile.data.IpfsHash}`;

        const json = {
            name: "Profile Image" + counter.toString(),
            image: fileHash,
            attributes: [
                {
                    "trait-type": "Stage" + counter.toString(),
                    value: counter.toString(),
                },
            ],
        };

        return json, fileHash;
    }
};

export const sendFileToIPFS2 = async (file) => {
    if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
            method: "post",
            url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
            data: formData,
            headers: {
                pinata_api_key: "bf67cf4376213d9d9cb0", // `${process.env.REACT_APP_PINATA_API_KEY}`,
                pinata_secret_api_key:
                    "5250eddb652c2e750bdf57d8ed79ee762564fed74c4ebfd78bb35dd4dbbe5a17", // `${process.env.REACT_APP_PINATA_API_SECRET}`,
                "Content-Type": "multipart/form-data",
            },
        });

        const fileHash = `https://ipfs.io/ipfs/${resFile.data.IpfsHash}`;

        return fileHash;
    }
};

const sendJsonToIpfs = async (json) => {
    const formData = new FormData();
    formData.append("json", json);

    const response = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
            pinata_api_key: "bf67cf4376213d9d9cb0", // `${process.env.REACT_APP_PINATA_API_KEY}`,
            pinata_secret_api_key:
                "5250eddb652c2e750bdf57d8ed79ee762564fed74c4ebfd78bb35dd4dbbe5a17", // `${process.env.REACT_APP_PINATA_API_SECRET}`,
            "Content-Type": "multipart/form-data",
        },
    });

    const uri = `https://ipfs.io/ipfs/${response.data.IpfsHash}`;

    return uri;
};

const Upkeeping = async (contract) => {
    const upkeepNeeded = await contract.checkUpkeep();
    if (upkeepNeeded) {
        await Contract.performUpkeep();
        return true;
    }
    return false;
};

const getUserContract = async (userId, bearerToken) => {
    const resp = await axios.post(
        "https://flipper.inteliblockchain.co/v1/user/getContractAddress",
        {
            id: userId,
        },
        {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        }
    );
};

const sendUriToContract = async (signedContract, uri) => {
    const transaction = await signedContract.updateImage(uri);
    transaction.wait();
    console.log("finished");
    return "OK";
};

const sendLinkToBackend = async (imageLink, bearerToken) => {
    const resp = await axios.put(
        `https://flipper.inteliblockchain.co/v1/user/updateImage/`,
        {
            imgUrl: imageLink,
        },

        {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        }
    );
    return resp;
};

const updateImage = async (image, provider, authToken, userId) => {
    try {
        //get user's contract address from backend
        const userContractAddress = await getUserContract(userId, authToken);

        //prepare contract
        const contract = prepareContract(provider, userContractAddress);

        Upkeeping(contract).then((res) => {
            console.log("needed upkeep? ", res);
        });

        // get counter
        const counter = await getImagesCounter(contract);

        // send image to ipfs
        const [json, imageLink] = await sendFileToIPFS(image, counter);

        //send json with image link to ipfs
        const uri = await sendJsonToIpfs(json);

        //save json address inside user contract
        const signer = await provider.getSigner();
        const signedContract = contract.connect(signer);
        const response = await sendUriToContract(signedContract, uri);

        sendLinkToBackend(imageLink, authToken);

        return response;
    } catch (err) {
        alert(err);
    }
};
