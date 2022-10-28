import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

export function set_provider() {

    const provider = detectEthereumProvider()
    .then(function(success) {
        return success;
    }, function (error) {
        console.log(error);
        alert("Please install Metamask");
        return null;
    });
    return provider;
}

export async function getWeb3() {
    let web3 = set_provider().then(function(provider) {
    return new Web3(provider);
    }, function(error) {
    })
    return await web3;
}