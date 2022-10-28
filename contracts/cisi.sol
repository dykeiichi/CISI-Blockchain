// SPDX-License-Identifier: None

pragma solidity ^0.8.17;

contract CISI_2022 {

    address public owner;

    struct Customer {
        string name;
        bool is_internal;
    }

    struct Congress {
        string date;
        uint price;
    }

    Congress[] private congresses;

    mapping(address => Customer) customers;
    mapping(address => Congress[]) assistence;

    constructor() {
        owner = msg.sender;
    }

    function getCustomer() public view returns (Customer memory) {
        Customer memory customer = customers[msg.sender];
        return customer;
    }

    function setCustomer(string memory name, bool is_internal) public {
        Customer storage customer = customers[msg.sender];
        customer.name = name;
        customer.is_internal = is_internal;
    }

    function get_conferences() public view returns (Congress[] memory) {
        return congresses;
    }

    function add_conferences(string memory name, uint price_in_wei) public is_Owner {
        congresses.push(Congress(name, price_in_wei));
    }

    function buyTicket(uint index) public is_Registered payable {
        Congress memory congress = congresses[index];
        require(msg.value == congress.price);
        assistence[msg.sender].push(congress);
    }

    function get_attendance() public is_Registered view returns (Congress[] memory) {
        return assistence[msg.sender];
    }

    modifier is_Owner() {
        require(msg.sender == owner);
        _;
    }

    modifier is_Registered() {
        Customer memory customer = customers[msg.sender];
        require(keccak256(abi.encode(customer.name)) != keccak256(""));
        _;
    }
}