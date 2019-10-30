pragma solidity ^0.5.0;


/**
 * @title LinkedList
 * @dev Data structure
 */
contract LinkedList {

    event ObjectCreated(uint256 id, uint256 data);
    event ObjectsLinked(uint256 prev, uint256 next);
    event NewHead(uint256 id);
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

    function findPrevId(uint256 _id)
        public
        view
        returns (uint256)
    {
        Object memory prevObject = objects[head];
        while (prevObject.next != _id) {
            prevObject = objects[prevObject.next];
        }
        return prevObject.id;
    }

    function findTailId()
        public
        view
        returns (uint256)
    {
        Object memory oldTailObject = objects[head];
        while (oldTailObject.next != 0) {
            oldTailObject = objects[oldTailObject.next];
        }
        return oldTailObject.id;
    }

    function findIdForData(uint256 _data)
        public
        view
        returns (uint256)
    {
        Object memory object = objects[head];
        while (object.data != _data) {
            object = objects[object.next];
        }
        return object.id;
    }

    function addHead(uint256 _data)
        public
        returns (bool)
    {
        uint256 objectId = _createObject(_data);
        _link(objectId, head);
        head = objectId;
        emit NewHead(objectId);
    }

    function addTail(uint256 _data)
        public
        returns (bool)
    {
        if (head == 0) {
            addHead(_data);
        }
        else {
            uint256 oldTailId = findTailId();
            uint256 newTailId = _createObject(_data);
            _link(oldTailId, newTailId);
        }
    }

    function remove(uint256 _id)
        public
    {
        Object memory removeObject = objects[_id];
        if (head == _id) {
            head = removeObject.next;
            emit NewHead(_id);
        }
        else {
            uint256 prevObjectId = findPrevId(_id);
            _link(prevObjectId, removeObject.next);
        }
        delete objects[removeObject.id];
        emit ObjectRemoved(_id);
    }

    function insertAfter(uint256 _prevId, uint256 _data)
        public
        returns (bool)
    {
        Object memory prevObject = objects[_prevId];
        uint256 newObjectId = _createObject(_data);
        _link(newObjectId, prevObject.next);
        _link(prevObject.id, newObjectId);
    }

    function insertBefore(uint256 _nextId, uint256 _data)
        public
        returns (bool)
    {
        if (_nextId == head) {
            addHead(_data);
        }
        else {
            uint256 prevId = findPrevId(_nextId);
            insertAfter(prevId, _data);
        }
    }

    function _createObject(uint256 _data)
        internal
        returns (uint256)
    {
        uint256 newId = idCounter;
        idCounter += 1;
        Object memory object = Object(newId, 0, _data);
        objects[object.id] = object;
        emit ObjectCreated(
            object.id,
            object.data
        );
        return object.id;
    }

    function _link(uint256 _prevId, uint256 _nextId)
        internal
    {
        objects[_prevId].next = _nextId;
        emit ObjectsLinked(_prevId, _nextId);
    }
}