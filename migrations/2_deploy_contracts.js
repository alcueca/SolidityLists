const LinkedList = artifacts.require('./LinkedList.sol');
const DoubleLinkedList = artifacts.require('./DoubleLinkedList.sol');

module.exports = (deployer) => {
    deployer.deploy(LinkedList);
    deployer.deploy(DoubleLinkedList);
};
