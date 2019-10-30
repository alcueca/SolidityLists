pragma solidity ^0.5.0;


/**
 * @title LinkedList
 * @dev Data structure
 */
contract DoubleLinkedList {

    event ObjectAdded(uint256 id, uint256 next, uint256 prev, uint256 data);
    event ObjectRemoved(uint256 id);

    struct Object{
        uint256 id;
        uint256 next;
        uint256 prev;
        uint256 data;
    }

    uint256 public head;
    uint256 public tail;
    uint256 public idCounter;
    mapping (uint256 => Object) public objects;

    /**
     * Constructor method
     */
    constructor() public {
        head = 0;
        tail = 0;
        idCounter = 1;
    }

    function get(uint256 _id)
        public
        view
        returns (uint256, uint256, uint256, uint256)
    {
        Object memory object = objects[_id];
        return (object.id, object.next, object.prev, object.data);
    }

    function addHead(uint256 _data)
        public
        returns (bool)
    {
        uint256 newId = idCounter;
        idCounter += 1;
        Object memory newObject = Object(
            newId,
            head,
            0,
            _data
        );
        objects[newObject.id] = newObject;

        if (head != 0) {
            // If there is a next object link it to this one
            Object memory nextObject = objects[newObject.next];
            nextObject.prev = newObject.id;
            objects[nextObject.id] = nextObject;
        }
        else {
            // If there isn't, this object is also the tail
            tail = newObject.id;
        }
        head = newObject.id;

        emit ObjectAdded(
            newObject.id,
            newObject.next,
            newObject.prev,
            newObject.data
        );
    }

    // We use the same variable to generate ids and to keep track of object count
    function addTail(uint256 _data)
        public
        returns (bool)
    {
        if (head == 0) {
            addHead(_data);
        }
        else {
            // Find tail
            Object memory tailObject = objects[tail];

            // Append new tail
            uint256 newId = idCounter;
            idCounter += 1;
            Object memory newTail = Object(
                newId,
                0,
                tailObject.id,
                _data
            );
            objects[newTail.id] = newTail;

            // Link old tail to new one
            tailObject.next = newTail.id;
            objects[tailObject.id] = tailObject;

            // Finish
            emit ObjectAdded(
                newTail.id,
                newTail.next,
                newTail.prev,
                newTail.data
            );
        }
    }

    function remove(uint256 _id)
        public
    {
        Object memory removeObject;
        if (head == _id) {
            // Head object is the one to remove
            removeObject = objects[head];
            head = removeObject.next;
            Object memory newHead = objects[head];
            newHead.prev = 0;
            objects[head] = newHead;
        }
        else if (tail == _id) {
            // Tail object is the one to remove
            removeObject = objects[tail];
            tail = removeObject.prev;
            Object memory newTail = objects[tail];
            newTail.next = 0;
            objects[tail] = newTail;
        }
        else {
            // Find object to remove
            removeObject = objects[_id];
            Object memory nextObject = objects[removeObject.next];
            Object memory prevObject = objects[removeObject.prev];

            // Link prev object to next object and viceversa
            prevObject.next = removeObject.next;
            nextObject.prev = removeObject.prev;
            objects[prevObject.id] = prevObject;
            objects[nextObject.id] = nextObject;
        }
        assert (_id == removeObject.id);
        delete objects[removeObject.id];
        emit ObjectRemoved(_id);
    }

    function insertAfter(uint256 _prevId, uint256 _data)
        public
        returns (bool)
    {
        // Find where to insert
        Object memory prevObject = objects[head];
        while (prevObject.id != _prevId) {
            // if (prevObject.next == 0) revert(); No need to check, we will revert anyway.
            prevObject = objects[prevObject.next];
        }
        uint256 newId = idCounter;
        idCounter += 1;
        // Insert new object
        Object memory insertedObject = Object(
            newId,
            prevObject.next,
            prevObject.id,
            _data
        );
        objects[insertedObject.id] = insertedObject;
        // If not inserting at the tail link next object back to inserted one.
        Object memory nextObject;
        if (prevObject.id != tail) {
            nextObject = objects[prevObject.next];
            nextObject.prev = newId;
            objects[nextObject.id] = nextObject;
        }
        // Link prev object to new object
        prevObject.next = insertedObject.id;
        objects[prevObject.id] = prevObject;
        emit ObjectAdded(
            insertedObject.id,
            insertedObject.next,
            insertedObject.prev,
            insertedObject.data
        );
    }

    function insertBefore(uint256 _nextId, uint256 _data)
        public
        returns (bool)
    {
        if (_nextId == head) {
            addHead(_data);
        }
        else {
            // Find where to insert
            Object memory prevObject = objects[head];
            while (prevObject.next != _nextId) {
                // if (prevObject.next == 0) revert(); No need to check, we will revert anyway.
                prevObject = objects[prevObject.next];
            }
            // Insert new object
            uint256 newId = idCounter;
            idCounter += 1;
            Object memory insertedObject = Object(
                newId,
                prevObject.next,
                prevObject.id,
                _data
            );
            objects[newId] = insertedObject;
            // Link next object back to inserted one.
            Object memory nextObject = objects[prevObject.next];
            nextObject.prev = newId;
            objects[nextObject.id] = nextObject;
            // Link prev object to new object
            prevObject.next = newId;
            objects[prevObject.id] = prevObject;
            emit ObjectAdded(
                insertedObject.id,
                insertedObject.next,
                insertedObject.prev,
                insertedObject.data
            );
        }
    }
}