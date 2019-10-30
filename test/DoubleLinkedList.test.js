const chai = require('chai');

const DoubleLinkedList = artifacts.require('./DoubleLinkedList.sol');
const { itShouldThrow } = require('./utils');
chai.should();


/** @test {DoubleLinkedList} contract */
contract('DoubleLinkedList - add', (accounts) => {

    let doubleLinkedList;

    beforeEach(async () => {
        doubleLinkedList = await DoubleLinkedList.new();
    });

    /**
     * Test the two contract methods
     * @test {DoubleLinkedList#set} and {DoubleLinkedList#get}
     */
    it('Constructor variables.', async () => {
        ((await doubleLinkedList.idCounter.call()).toNumber()).should.be.equal(1);
    });

    it('get on a non existing object returns (0,0,0,0).', async () => {
        const result = (await doubleLinkedList.get(0));
        result[0].toNumber().should.be.equal(0);
        result[1].toNumber().should.be.equal(0);
        result[2].toNumber().should.be.equal(0);
        result[3].toNumber().should.be.equal(0);
    });

    it('adds an object at the head - event emission.', async () => {
        const objectEvent = (
            await doubleLinkedList.addHead(100)
        ).logs[0];
        objectEvent.args.id.toNumber().should.be.equal(1);
        objectEvent.args.next.toNumber().should.be.equal(0);
        objectEvent.args.prev.toNumber().should.be.equal(0);
        objectEvent.args.data.toNumber().should.be.equal(100);
    });

    it('adds an object at the head - data storage.', async () => {
        const objectId = (
            await doubleLinkedList.addHead(100)
        ).logs[0].args.id.toNumber();
        
        const result = (await doubleLinkedList.get(objectId));
        result[0].toNumber().should.be.equal(objectId);
        result[1].toNumber().should.be.equal(0);
        result[2].toNumber().should.be.equal(0);
        result[3].toNumber().should.be.equal(100);
    });

    it('adds two objects from the head.', async () => {
        const objectOneId = (
            await doubleLinkedList.addHead(100)
        ).logs[0].args.id.toNumber();
        const objectTwoId = (
            await doubleLinkedList.addHead(200)
        ).logs[0].args.id.toNumber();

        const objectOne = (await doubleLinkedList.get(objectOneId));
        objectOne[0].toNumber().should.be.equal(objectOneId);
        objectOne[1].toNumber().should.be.equal(0);
        objectOne[2].toNumber().should.be.equal(objectTwoId);
        objectOne[3].toNumber().should.be.equal(100);

        const objectTwo = (await doubleLinkedList.get(objectTwoId));
        objectTwo[0].toNumber().should.be.equal(objectTwoId);
        objectTwo[1].toNumber().should.be.equal(objectOneId);
        objectTwo[2].toNumber().should.be.equal(0);
        objectTwo[3].toNumber().should.be.equal(200);

        ((await doubleLinkedList.head.call()).toNumber()).should.be.equal(objectTwoId);
    });

    it('adds an object at the tail - event emission.', async () => {
        const objectEvent = (
            await doubleLinkedList.addTail(100)
        ).logs[0];
        objectEvent.args.id.toNumber().should.be.equal(1);
        objectEvent.args.next.toNumber().should.be.equal(0);
        objectEvent.args.prev.toNumber().should.be.equal(0);
        objectEvent.args.data.toNumber().should.be.equal(100);
    });

    it('adds an object at the tail - data storage.', async () => {
        const objectId = (
            await doubleLinkedList.addTail(100)
        ).logs[0].args.id.toNumber();
        
        const result = (await doubleLinkedList.get(objectId));
        result[0].toNumber().should.be.equal(objectId);
        result[1].toNumber().should.be.equal(0);
        result[2].toNumber().should.be.equal(0);
        result[3].toNumber().should.be.equal(100);
    });

    it('adds two objects from the tail.', async () => {
        const objectOneId = (
            await doubleLinkedList.addTail(100)
        ).logs[0].args.id.toNumber();
        const objectTwoId = (
            await doubleLinkedList.addTail(200)
        ).logs[0].args.id.toNumber();

        const objectOne = (await doubleLinkedList.get(objectOneId));
        objectOne[0].toNumber().should.be.equal(objectOneId);
        objectOne[1].toNumber().should.be.equal(objectTwoId);
        objectOne[2].toNumber().should.be.equal(0);
        objectOne[3].toNumber().should.be.equal(100);

        const objectTwo = (await doubleLinkedList.get(objectTwoId));
        objectTwo[0].toNumber().should.be.equal(objectTwoId);
        objectTwo[1].toNumber().should.be.equal(0);
        objectTwo[2].toNumber().should.be.equal(objectOneId);
        objectTwo[3].toNumber().should.be.equal(200);

        ((await doubleLinkedList.head.call()).toNumber()).should.be.equal(objectOneId);
    });
});

/** @test {doubleLinkedList} contract */
contract('doubleLinkedList - remove', (accounts) => {

    let doubleLinkedList;
    let headId;
    let middleId;
    let tailId;

    beforeEach(async () => {
        doubleLinkedList = await DoubleLinkedList.new();
        tailId = (
            await doubleLinkedList.addHead(300)
        ).logs[0].args.id.toNumber();
        middleId = (
            await doubleLinkedList.addHead(200)
        ).logs[0].args.id.toNumber();
        headId = (
            await doubleLinkedList.addHead(100)
        ).logs[0].args.id.toNumber();

    });

    it('removes the head.', async () => {
        const removedId = (
            await doubleLinkedList.remove(headId)
        ).logs[0].args.id.toNumber();
        removedId.should.be.equal(headId);
        ((await doubleLinkedList.head.call()).toNumber()).should.be.equal(middleId);

        const middleObject = (await doubleLinkedList.get(middleId));
        middleObject[0].toNumber().should.be.equal(middleId);
        middleObject[1].toNumber().should.be.equal(tailId);
        middleObject[2].toNumber().should.be.equal(0);
        middleObject[3].toNumber().should.be.equal(200);

        const tailObject = (await doubleLinkedList.get(tailId));
        tailObject[0].toNumber().should.be.equal(tailId);
        tailObject[1].toNumber().should.be.equal(0);
        tailObject[2].toNumber().should.be.equal(middleId);
        tailObject[3].toNumber().should.be.equal(300);
    });

    it('removes the tail.', async () => {
        const removedId = (
            await doubleLinkedList.remove(tailId)
        ).logs[0].args.id.toNumber();
        removedId.should.be.equal(tailId);
        ((await doubleLinkedList.head.call()).toNumber()).should.be.equal(headId);

        const headObject = (await doubleLinkedList.get(headId));
        headObject[0].toNumber().should.be.equal(headId);
        headObject[1].toNumber().should.be.equal(middleId);
        headObject[2].toNumber().should.be.equal(0);
        headObject[3].toNumber().should.be.equal(100);

        const middleObject = (await doubleLinkedList.get(middleId));
        middleObject[0].toNumber().should.be.equal(middleId);
        middleObject[1].toNumber().should.be.equal(0);
        middleObject[2].toNumber().should.be.equal(headId);
        middleObject[3].toNumber().should.be.equal(200);
    });

    it('removes the middle.', async () => {
        const removedId = (
            await doubleLinkedList.remove(middleId)
        ).logs[0].args.id.toNumber();
        removedId.should.be.equal(middleId);
        ((await doubleLinkedList.head.call()).toNumber()).should.be.equal(headId);

        const headObject = (await doubleLinkedList.get(headId));
        headObject[0].toNumber().should.be.equal(headId);
        headObject[1].toNumber().should.be.equal(tailId);
        headObject[2].toNumber().should.be.equal(0);
        headObject[3].toNumber().should.be.equal(100);

        const tailObject = (await doubleLinkedList.get(tailId));
        tailObject[0].toNumber().should.be.equal(tailId);
        tailObject[1].toNumber().should.be.equal(0);
        tailObject[2].toNumber().should.be.equal(headId);
        tailObject[3].toNumber().should.be.equal(300);
    });
});

/** @test {doubleLinkedList} contract */
contract('doubleLinkedList - insert', (accounts) => {

    let doubleLinkedList;
    let headId;
    let middleId;
    let tailId;

    beforeEach(async () => {
        doubleLinkedList = await DoubleLinkedList.new();
        tailId = (
            await doubleLinkedList.addHead(300)
        ).logs[0].args.id.toNumber();
        middleId = (
            await doubleLinkedList.addHead(200)
        ).logs[0].args.id.toNumber();
        headId = (
            await doubleLinkedList.addHead(100)
        ).logs[0].args.id.toNumber();

    });

    it('inserts after the head.', async () => {
        const insertedId = (
            await doubleLinkedList.insertAfter(headId, 150)
        ).logs[0].args.id.toNumber();
        ((await doubleLinkedList.head.call()).toNumber()).should.be.equal(headId);

        const headObject = (await doubleLinkedList.get(headId));
        headObject[0].toNumber().should.be.equal(headId);
        headObject[1].toNumber().should.be.equal(insertedId);
        headObject[2].toNumber().should.be.equal(0);
        headObject[3].toNumber().should.be.equal(100);

        const insertedObject = (await doubleLinkedList.get(insertedId));
        insertedObject[0].toNumber().should.be.equal(insertedId);
        insertedObject[1].toNumber().should.be.equal(middleId);
        insertedObject[2].toNumber().should.be.equal(headId);
        insertedObject[3].toNumber().should.be.equal(150);

        const middleObject = (await doubleLinkedList.get(middleId));
        middleObject[0].toNumber().should.be.equal(middleId);
        middleObject[1].toNumber().should.be.equal(tailId);
        middleObject[2].toNumber().should.be.equal(insertedId);
        middleObject[3].toNumber().should.be.equal(200);

        const tailObject = (await doubleLinkedList.get(tailId));
        tailObject[0].toNumber().should.be.equal(tailId);
        tailObject[1].toNumber().should.be.equal(0);
        tailObject[2].toNumber().should.be.equal(middleId);
        tailObject[3].toNumber().should.be.equal(300);
    });

    it('inserts after the tail.', async () => {
        const insertedId = (
            await doubleLinkedList.insertAfter(tailId, 150)
        ).logs[0].args.id.toNumber();
        ((await doubleLinkedList.head.call()).toNumber()).should.be.equal(headId);

        const headObject = (await doubleLinkedList.get(headId));
        headObject[0].toNumber().should.be.equal(headId);
        headObject[1].toNumber().should.be.equal(middleId);
        headObject[2].toNumber().should.be.equal(0);
        headObject[3].toNumber().should.be.equal(100);

        const middleObject = (await doubleLinkedList.get(middleId));
        middleObject[0].toNumber().should.be.equal(middleId);
        middleObject[1].toNumber().should.be.equal(tailId);
        middleObject[2].toNumber().should.be.equal(headId);
        middleObject[3].toNumber().should.be.equal(200);

        const tailObject = (await doubleLinkedList.get(tailId));
        tailObject[0].toNumber().should.be.equal(tailId);
        tailObject[1].toNumber().should.be.equal(insertedId);
        tailObject[2].toNumber().should.be.equal(middleId);
        tailObject[3].toNumber().should.be.equal(300);

        const insertedObject = (await doubleLinkedList.get(insertedId));
        insertedObject[0].toNumber().should.be.equal(insertedId);
        insertedObject[1].toNumber().should.be.equal(0);
        insertedObject[2].toNumber().should.be.equal(tailId);
        insertedObject[3].toNumber().should.be.equal(150);
    });

    it('inserts after the middle.', async () => {
        const insertedId = (
            await doubleLinkedList.insertAfter(middleId, 150)
        ).logs[0].args.id.toNumber();
        ((await doubleLinkedList.head.call()).toNumber()).should.be.equal(headId);

        const headObject = (await doubleLinkedList.get(headId));
        headObject[0].toNumber().should.be.equal(headId);
        headObject[1].toNumber().should.be.equal(middleId);
        headObject[2].toNumber().should.be.equal(0);
        headObject[3].toNumber().should.be.equal(100);

        const middleObject = (await doubleLinkedList.get(middleId));
        middleObject[0].toNumber().should.be.equal(middleId);
        middleObject[1].toNumber().should.be.equal(insertedId);
        middleObject[2].toNumber().should.be.equal(headId);
        middleObject[3].toNumber().should.be.equal(200);

        const insertedObject = (await doubleLinkedList.get(insertedId));
        insertedObject[0].toNumber().should.be.equal(insertedId);
        insertedObject[1].toNumber().should.be.equal(tailId);
        insertedObject[2].toNumber().should.be.equal(middleId);
        insertedObject[3].toNumber().should.be.equal(150);

        const tailObject = (await doubleLinkedList.get(tailId));
        tailObject[0].toNumber().should.be.equal(tailId);
        tailObject[1].toNumber().should.be.equal(0);
        tailObject[2].toNumber().should.be.equal(insertedId);
        tailObject[3].toNumber().should.be.equal(300);
    });

    it('inserts before the head.', async () => {
        const insertedId = (
            await doubleLinkedList.insertBefore(headId, 150)
        ).logs[0].args.id.toNumber();
        ((await doubleLinkedList.head.call()).toNumber()).should.be.equal(insertedId);

        const insertedObject = (await doubleLinkedList.get(insertedId));
        insertedObject[0].toNumber().should.be.equal(insertedId);
        insertedObject[1].toNumber().should.be.equal(headId);
        insertedObject[2].toNumber().should.be.equal(0);
        insertedObject[3].toNumber().should.be.equal(150);

        const headObject = (await doubleLinkedList.get(headId));
        headObject[0].toNumber().should.be.equal(headId);
        headObject[1].toNumber().should.be.equal(middleId);
        headObject[2].toNumber().should.be.equal(insertedId);
        headObject[3].toNumber().should.be.equal(100);

        const middleObject = (await doubleLinkedList.get(middleId));
        middleObject[0].toNumber().should.be.equal(middleId);
        middleObject[1].toNumber().should.be.equal(tailId);
        middleObject[2].toNumber().should.be.equal(headId);
        middleObject[3].toNumber().should.be.equal(200);

        const tailObject = (await doubleLinkedList.get(tailId));
        tailObject[0].toNumber().should.be.equal(tailId);
        tailObject[1].toNumber().should.be.equal(0);
        tailObject[2].toNumber().should.be.equal(middleId);
        tailObject[3].toNumber().should.be.equal(300);
    });

    it('inserts before the tail.', async () => {
        const insertedId = (
            await doubleLinkedList.insertBefore(tailId, 150)
        ).logs[0].args.id.toNumber();
        ((await doubleLinkedList.head.call()).toNumber()).should.be.equal(headId);

        const headObject = (await doubleLinkedList.get(headId));
        headObject[0].toNumber().should.be.equal(headId);
        headObject[1].toNumber().should.be.equal(middleId);
        headObject[2].toNumber().should.be.equal(0);
        headObject[3].toNumber().should.be.equal(100);

        const middleObject = (await doubleLinkedList.get(middleId));
        middleObject[0].toNumber().should.be.equal(middleId);
        middleObject[1].toNumber().should.be.equal(insertedId);
        middleObject[2].toNumber().should.be.equal(headId);
        middleObject[3].toNumber().should.be.equal(200);

        const insertedObject = (await doubleLinkedList.get(insertedId));
        insertedObject[0].toNumber().should.be.equal(insertedId);
        insertedObject[1].toNumber().should.be.equal(tailId);
        insertedObject[2].toNumber().should.be.equal(middleId);
        insertedObject[3].toNumber().should.be.equal(150);

        const tailObject = (await doubleLinkedList.get(tailId));
        tailObject[0].toNumber().should.be.equal(tailId);
        tailObject[1].toNumber().should.be.equal(0);
        tailObject[2].toNumber().should.be.equal(insertedId);
        tailObject[3].toNumber().should.be.equal(300);
    });

    it('inserts before the middle.', async () => {
        const insertedId = (
            await doubleLinkedList.insertBefore(middleId, 150)
        ).logs[0].args.id.toNumber();
        ((await doubleLinkedList.head.call()).toNumber()).should.be.equal(headId);

        const headObject = (await doubleLinkedList.get(headId));
        headObject[0].toNumber().should.be.equal(headId);
        headObject[1].toNumber().should.be.equal(insertedId);
        headObject[2].toNumber().should.be.equal(0);
        headObject[3].toNumber().should.be.equal(100);

        const insertedObject = (await doubleLinkedList.get(insertedId));
        insertedObject[0].toNumber().should.be.equal(insertedId);
        insertedObject[1].toNumber().should.be.equal(middleId);
        insertedObject[2].toNumber().should.be.equal(headId);
        insertedObject[3].toNumber().should.be.equal(150);

        const middleObject = (await doubleLinkedList.get(middleId));
        middleObject[0].toNumber().should.be.equal(middleId);
        middleObject[1].toNumber().should.be.equal(tailId);
        middleObject[2].toNumber().should.be.equal(insertedId);
        middleObject[3].toNumber().should.be.equal(200);

        const tailObject = (await doubleLinkedList.get(tailId));
        tailObject[0].toNumber().should.be.equal(tailId);
        tailObject[1].toNumber().should.be.equal(0);
        tailObject[2].toNumber().should.be.equal(middleId);
        tailObject[3].toNumber().should.be.equal(300);
    });
});