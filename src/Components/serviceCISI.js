import { set_provider } from "./metmask";
import Web3 from 'web3';

let web3 = null;
const contractABI = require('../Contracts/CISI.json')
const contractAddress = "0x60e645EFcdFF00A17434AB38FEA19a33Be1825b7";

export const CISIContract = set_provider().then(function(provider) {
    web3 = new Web3(provider)
    return new web3.eth.Contract(
        contractABI,
        contractAddress
      );
}, function(error) {
    console.log(error);
})


export class serviceCISI {

    async getCustomer() {
        return await (await (await (await CISIContract).methods).getCustomer()).call();
    }

    async setCustomer(name, is_internal, account) {
        return await (await (await (await CISIContract).methods).setCustomer(name, is_internal)).send({from: account});
    }

    async get_conferences() {
        return await (await (await (await CISIContract).methods).get_conferences()).call();
    }

    async add_conferences(name, price, account) {
        return await (await (await (await CISIContract).methods).add_conferences(name, price)).send({from: account});
    }

    async buyTicket(index, value, account) {
        return await (await (await (await CISIContract).methods).buyTicket(index)).send({from: account, value: value});
    }

    async get_attendance(account) {
        return await (await (await (await CISIContract).methods).get_attendance()).call({from: account});
    }
}