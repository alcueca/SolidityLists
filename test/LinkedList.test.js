const chai = require('chai');

const LinkedList = artifacts.require('./LinkedList.sol');
const { itShouldThrow } = require('./utils');
chai.should();


/** @test {LinkedList} contract */
contract('LinkedList - add', (accounts) => {

    let linkedList;

    beforeEach(async () => {
        linkedList = await LinkedList.new();
    });

    /**
     * Test the two contract methods
     * @test {LinkedList#set} and {LinkedList#get}
     */
    it('Constructor variables.', async () => {
        ((await linkedList.idCounter.call()).toNumber()).should.be.equal(1);
    });

    it('get on a non existing object returns (0,0,0).', async () => {
        const result = (await linkedList.get(0));
        result[0].toNumber().should.be.equal(0);
        result[1].toNumber().should.be.equal(0);
        result[2].toNumber().should.be.equal(0);
    });

    it('adds an object at the head - event emission.', async () => {
        const objectEvent = (
            await linkedList.addHead(100)
        ).logs[0];
        objectEvent.args.id.toNumber().should.be.equal(1);
        objectEvent.args.data.toNumber().should.be.equal(100);
    });

    it('adds an object at the head - data storage.', async () => {
        const objectId = (
            await linkedList.addHead(100)
        ).logs[0].args.id.toNumber();
        
        const result = (await linkedList.get(objectId));
        result[0].toNumber().should.be.equal(objectId);
        result[1].toNumber().should.be.equal(0);
        result[2].toNumber().should.be.equal(100);
    });

    it('adds two objects from the head.', async () => {
        const objectOneId = (
            await linkedList.addHead(100)
        ).logs[0].args.id.toNumber();
        const objectTwoId = (
            await linkedList.addHead(200)
        ).logs[0].args.id.toNumber();

        const objectOne = (await linkedList.get(objectOneId));
        objectOne[0].toNumber().should.be.equal(objectOneId);
        objectOne[1].toNumber().should.be.equal(0);
        objectOne[2].toNumber().should.be.equal(100);

        const objectTwo = (await linkedList.get(objectTwoId));
        objectTwo[0].toNumber().should.be.equal(objectTwoId);
        objectTwo[1].toNumber().should.be.equal(objectOneId);
        objectTwo[2].toNumber().should.be.equal(200);

        ((await linkedList.head.call()).toNumber()).should.be.equal(objectTwoId);
    });

    it('adds an object at the tail - event emission.', async () => {
        const objectEvent = (
            await linkedList.addTail(100)
        ).logs[0];
        objectEvent.args.id.toNumber().should.be.equal(1);
        objectEvent.args.data.toNumber().should.be.equal(100);
    });

    it('adds an object at the tail - data storage.', async () => {
        const objectId = (
            await linkedList.addTail(100)
        ).logs[0].args.id.toNumber();
        
        const result = (await linkedList.get(objectId));
        result[0].toNumber().should.be.equal(objectId);
        result[1].toNumber().should.be.equal(0);
        result[2].toNumber().should.be.equal(100);
    });

    it('adds two objects from the tail.', async () => {
        const objectOneId = (
            await linkedList.addTail(100)
        ).logs[0].args.id.toNumber();
        const objectTwoId = (
            await linkedList.addTail(200)
        ).logs[0].args.id.toNumber();

        const objectOne = (await linkedList.get(objectOneId));
        objectOne[0].toNumber().should.be.equal(objectOneId);
        objectOne[1].toNumber().should.be.equal(objectTwoId);
        objectOne[2].toNumber().should.be.equal(100);

        const objectTwo = (await linkedList.get(objectTwoId));
        objectTwo[0].toNumber().should.be.equal(objectTwoId);
        objectTwo[1].toNumber().should.be.equal(0);
        objectTwo[2].toNumber().should.be.equal(200);

        ((await linkedList.head.call()).toNumber()).should.be.equal(objectOneId);
    });
});

contract('LinkedList - insert', (accounts) => {

    let linkedList;
    let headId;
    let middleId;
    let tailId;

    beforeEach(async () => {
        linkedList = await LinkedList.new();
        tailId = (
            await linkedList.addHead(300)
        ).logs[0].args.id.toNumber();
        middleId = (
            await linkedList.addHead(200)
        ).logs[0].args.id.toNumber();
        headId = (
            await linkedList.addHead(100)
        ).logs[0].args.id.toNumber();
    });

    it('finds an id for given data.', async () => {
        const headData = (await linkedList.findIdForData(100));
        headData.toNumber().should.be.equal(headId);
        const middleData = (await linkedList.findIdForData(200));
        middleData.toNumber().should.be.equal(middleId);
        const tailData = (await linkedList.findIdForData(300));
        tailData.toNumber().should.be.equal(tailId);
    });
});

/** @test {LinkedList} contract */
contract('LinkedList - remove', (accounts) => {

    let linkedList;
    let headId;
    let middleId;
    let tailId;

    beforeEach(async () => {
        linkedList = await LinkedList.new();
        tailId = (
            await linkedList.addHead(300)
        ).logs[0].args.id.toNumber();
        middleId = (
            await linkedList.addHead(200)
        ).logs[0].args.id.toNumber();
        headId = (
            await linkedList.addHead(100)
        ).logs[0].args.id.toNumber();

    });

    it('removes the head.', async () => {
        const removedId = (
            await linkedList.remove(headId)
        ).logs[1].args.id.toNumber();
        removedId.should.be.equal(headId);
        ((await linkedList.head.call()).toNumber()).should.be.equal(middleId);

        const middleObject = (await linkedList.get(middleId));
        middleObject[0].toNumber().should.be.equal(middleId);
        middleObject[1].toNumber().should.be.equal(tailId);
        middleObject[2].toNumber().should.be.equal(200);

        const tailObject = (await linkedList.get(tailId));
        tailObject[0].toNumber().should.be.equal(tailId);
        tailObject[1].toNumber().should.be.equal(0);
        tailObject[2].toNumber().should.be.equal(300);
    });

    it('removes the tail.', async () => {
        const removedId = (
            await linkedList.remove(tailId)
        ).logs[1].args.id.toNumber();
        removedId.should.be.equal(tailId);
        ((await linkedList.head.call()).toNumber()).should.be.equal(headId);

        const headObject = (await linkedList.get(headId));
        headObject[0].toNumber().should.be.equal(headId);
        headObject[1].toNumber().should.be.equal(middleId);
        headObject[2].toNumber().should.be.equal(100);

        const middleObject = (await linkedList.get(middleId));
        middleObject[0].toNumber().should.be.equal(middleId);
        middleObject[1].toNumber().should.be.equal(0);
        middleObject[2].toNumber().should.be.equal(200);
    });

    it('removes the middle.', async () => {
        const removedId = (
            await linkedList.remove(middleId)
        ).logs[1].args.id.toNumber();
        removedId.should.be.equal(middleId);
        ((await linkedList.head.call()).toNumber()).should.be.equal(headId);

        const headObject = (await linkedList.get(headId));
        headObject[0].toNumber().should.be.equal(headId);
        headObject[1].toNumber().should.be.equal(tailId);
        headObject[2].toNumber().should.be.equal(100);

        const tailObject = (await linkedList.get(tailId));
        tailObject[0].toNumber().should.be.equal(tailId);
        tailObject[1].toNumber().should.be.equal(0);
        tailObject[2].toNumber().should.be.equal(300);
    });
});

/** @test {LinkedList} contract */
contract('LinkedList - insert', (accounts) => {

    let linkedList;
    let headId;
    let middleId;
    let tailId;

    beforeEach(async () => {
        linkedList = await LinkedList.new();
        tailId = (
            await linkedList.addHead(300)
        ).logs[0].args.id.toNumber();
        middleId = (
            await linkedList.addHead(200)
        ).logs[0].args.id.toNumber();
        headId = (
            await linkedList.addHead(100)
        ).logs[0].args.id.toNumber();
    });

    it('inserts after the head.', async () => {
        const insertedId = (
            await linkedList.insertAfter(headId, 150)
        ).logs[0].args.id.toNumber();
        ((await linkedList.head.call()).toNumber()).should.be.equal(headId);

        const headObject = (await linkedList.get(headId));
        headObject[0].toNumber().should.be.equal(headId);
        headObject[1].toNumber().should.be.equal(insertedId);
        headObject[2].toNumber().should.be.equal(100);

        const insertedObject = (await linkedList.get(insertedId));
        insertedObject[0].toNumber().should.be.equal(insertedId);
        insertedObject[1].toNumber().should.be.equal(middleId);
        insertedObject[2].toNumber().should.be.equal(150);

        const middleObject = (await linkedList.get(middleId));
        middleObject[0].toNumber().should.be.equal(middleId);
        middleObject[1].toNumber().should.be.equal(tailId);
        middleObject[2].toNumber().should.be.equal(200);

        const tailObject = (await linkedList.get(tailId));
        tailObject[0].toNumber().should.be.equal(tailId);
        tailObject[1].toNumber().should.be.equal(0);
        tailObject[2].toNumber().should.be.equal(300);
    });

    it('inserts after the tail.', async () => {
        const insertedId = (
            await linkedList.insertAfter(tailId, 150)
        ).logs[0].args.id.toNumber();
        ((await linkedList.head.call()).toNumber()).should.be.equal(headId);

        const headObject = (await linkedList.get(headId));
        headObject[0].toNumber().should.be.equal(headId);
        headObject[1].toNumber().should.be.equal(middleId);
        headObject[2].toNumber().should.be.equal(100);

        const middleObject = (await linkedList.get(middleId));
        middleObject[0].toNumber().should.be.equal(middleId);
        middleObject[1].toNumber().should.be.equal(tailId);
        middleObject[2].toNumber().should.be.equal(200);

        const tailObject = (await linkedList.get(tailId));
        tailObject[0].toNumber().should.be.equal(tailId);
        tailObject[1].toNumber().should.be.equal(insertedId);
        tailObject[2].toNumber().should.be.equal(300);

        const insertedObject = (await linkedList.get(insertedId));
        insertedObject[0].toNumber().should.be.equal(insertedId);
        insertedObject[1].toNumber().should.be.equal(0);
        insertedObject[2].toNumber().should.be.equal(150);
    });

    it('inserts after the middle.', async () => {
        const insertedId = (
            await linkedList.insertAfter(middleId, 150)
        ).logs[0].args.id.toNumber();
        ((await linkedList.head.call()).toNumber()).should.be.equal(headId);

        const headObject = (await linkedList.get(headId));
        headObject[0].toNumber().should.be.equal(headId);
        headObject[1].toNumber().should.be.equal(middleId);
        headObject[2].toNumber().should.be.equal(100);

        const middleObject = (await linkedList.get(middleId));
        middleObject[0].toNumber().should.be.equal(middleId);
        middleObject[1].toNumber().should.be.equal(insertedId);
        middleObject[2].toNumber().should.be.equal(200);

        const insertedObject = (await linkedList.get(insertedId));
        insertedObject[0].toNumber().should.be.equal(insertedId);
        insertedObject[1].toNumber().should.be.equal(tailId);
        insertedObject[2].toNumber().should.be.equal(150);

        const tailObject = (await linkedList.get(tailId));
        tailObject[0].toNumber().should.be.equal(tailId);
        tailObject[1].toNumber().should.be.equal(0);
        tailObject[2].toNumber().should.be.equal(300);
    });

    it('inserts before the head.', async () => {
        const insertedId = (
            await linkedList.insertBefore(headId, 150)
        ).logs[0].args.id.toNumber();
        ((await linkedList.head.call()).toNumber()).should.be.equal(insertedId);

        const insertedObject = (await linkedList.get(insertedId));
        insertedObject[0].toNumber().should.be.equal(insertedId);
        insertedObject[1].toNumber().should.be.equal(headId);
        insertedObject[2].toNumber().should.be.equal(150);

        const headObject = (await linkedList.get(headId));
        headObject[0].toNumber().should.be.equal(headId);
        headObject[1].toNumber().should.be.equal(middleId);
        headObject[2].toNumber().should.be.equal(100);

        const middleObject = (await linkedList.get(middleId));
        middleObject[0].toNumber().should.be.equal(middleId);
        middleObject[1].toNumber().should.be.equal(tailId);
        middleObject[2].toNumber().should.be.equal(200);

        const tailObject = (await linkedList.get(tailId));
        tailObject[0].toNumber().should.be.equal(tailId);
        tailObject[1].toNumber().should.be.equal(0);
        tailObject[2].toNumber().should.be.equal(300);
    });

    it('inserts before the tail.', async () => {
        const insertedId = (
            await linkedList.insertBefore(tailId, 150)
        ).logs[0].args.id.toNumber();
        ((await linkedList.head.call()).toNumber()).should.be.equal(headId);

        const headObject = (await linkedList.get(headId));
        headObject[0].toNumber().should.be.equal(headId);
        headObject[1].toNumber().should.be.equal(middleId);
        headObject[2].toNumber().should.be.equal(100);

        const middleObject = (await linkedList.get(middleId));
        middleObject[0].toNumber().should.be.equal(middleId);
        middleObject[1].toNumber().should.be.equal(insertedId);
        middleObject[2].toNumber().should.be.equal(200);

        const insertedObject = (await linkedList.get(insertedId));
        insertedObject[0].toNumber().should.be.equal(insertedId);
        insertedObject[1].toNumber().should.be.equal(tailId);
        insertedObject[2].toNumber().should.be.equal(150);

        const tailObject = (await linkedList.get(tailId));
        tailObject[0].toNumber().should.be.equal(tailId);
        tailObject[1].toNumber().should.be.equal(0);
        tailObject[2].toNumber().should.be.equal(300);
    });

    it('inserts before the middle.', async () => {
        const insertedId = (
            await linkedList.insertBefore(middleId, 150)
        ).logs[0].args.id.toNumber();
        ((await linkedList.head.call()).toNumber()).should.be.equal(headId);

        const headObject = (await linkedList.get(headId));
        headObject[0].toNumber().should.be.equal(headId);
        headObject[1].toNumber().should.be.equal(insertedId);
        headObject[2].toNumber().should.be.equal(100);

        const insertedObject = (await linkedList.get(insertedId));
        insertedObject[0].toNumber().should.be.equal(insertedId);
        insertedObject[1].toNumber().should.be.equal(middleId);
        insertedObject[2].toNumber().should.be.equal(150);

        const middleObject = (await linkedList.get(middleId));
        middleObject[0].toNumber().should.be.equal(middleId);
        middleObject[1].toNumber().should.be.equal(tailId);
        middleObject[2].toNumber().should.be.equal(200);

        const tailObject = (await linkedList.get(tailId));
        tailObject[0].toNumber().should.be.equal(tailId);
        tailObject[1].toNumber().should.be.equal(0);
        tailObject[2].toNumber().should.be.equal(300);
    });
});