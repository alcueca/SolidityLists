pragma solidity ^0.5.0;


/**
 * @title LinkedList
 * @dev Data structure
 */
contract LinkedList {

    event ObjectAdded(uint256 id, uint256 next, uint256 data);
    event ObjectRemoved(uint256 id);

    struct Object{
        uint256 id;
        uint256 next;
        uint256 data;
    }

    uint256 public head;
    uint256 public idCounter;
    mapping (uint256 => Object) public objects;

    /**
     * Constructor method
     */
    constructor() public {
        head = 0;
        idCounter = 1;
    }

    function get(uint256 _id)
        public
        view
        returns (uint256, uint256, uint256)
    {
        Object memory object = objects[_id];
        return (object.id, object.next, object.data);
    }

    function addHead(uint256 _data)
        public
        returns (bool)
    {
        uint256 newId = idCounter;
        idCounter += 1;
        Object memory object = Object(newId, head, _data);
        objects[object.id] = object;
        head = object.id;
        emit ObjectAdded(
            object.id,
            object.next,
            object.data
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
            Object memory tailObject = objects[head];
            while (tailObject.next != 0) {
                tailObject = objects[tailObject.next];
            }

            // Append new tail
            uint256 newId = idCounter;
            idCounter += 1;
            Object memory newTail = Object(newId, 0, _data);
            objects[newTail.id] = newTail;

            // Link old tail to new one
            tailObject.next = newTail.id;
            objects[tailObject.id] = tailObject;

            // Finish
            emit ObjectAdded(
                newTail.id,
                newTail.next,
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

        }
        else {
            // Find object to remove
            Object memory previousObject = objects[head];
            while (previousObject.next != _id) {
                // if (previousObject.next == 0) revert(); No need to check, we would revert anyway.
                previousObject = objects[previousObject.next];
            }
            removeObject = objects[previousObject.next];
            // Link previous object to the rest of the list
            previousObject.next = removeObject.next;
            objects[previousObject.id] = previousObject;
        }
        assert (_id == removeObject.id);
        delete objects[removeObject.id];
        emit ObjectRemoved(_id);
    }

    function insertAfter(uint256 _previousId, uint256 _data)
        public
        returns (bool)
    {
        // Find where to insert
        Object memory previousObject = objects[head];
        while (previousObject.id != _previousId) {
            // if (previousObject.next == 0) revert(); No need to check, we will revert anyway.
            previousObject = objects[previousObject.next];
        }
        // Insert new object
        uint256 newId = idCounter;
        idCounter += 1;
        Object memory insertedObject = Object(newId, previousObject.next, _data);
        objects[newId] = insertedObject;
        // Link previous object to new object
        previousObject.next = newId;
        objects[previousObject.id] = previousObject;
        emit ObjectAdded(
            insertedObject.id,
            insertedObject.next,
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
            Object memory previousObject = objects[head];
            while (previousObject.next != _nextId) {
                // if (previousObject.next == 0) revert(); No need to check, we will revert anyway.
                previousObject = objects[previousObject.next];
            }
            // Insert new object
            uint256 newId = idCounter;
            idCounter += 1;
            Object memory insertedObject = Object(newId, previousObject.next, _data);
            objects[newId] = insertedObject;
            // Link previous object to new object
            previousObject.next = newId;
            objects[previousObject.id] = previousObject;
            emit ObjectAdded(
                insertedObject.id,
                insertedObject.next,
                insertedObject.data
            );
        }
    }
}