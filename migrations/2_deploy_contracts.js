const LinkedList = artifacts.require('./LinkedList.sol');

module.exports = (deployer) => {
    deployer.deploy(LinkedList);
};
