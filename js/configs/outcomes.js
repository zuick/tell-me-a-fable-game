var outcomes = [ // исходы события (может сработать несколько)
    {
        type: "newSubject", // игрок получит нового персонажа
        subjectId: 4, // идентификатор персонажа
        condition: { // условие при котором сработает этот исход
            actionIds: [3,5,6], // идентификаторы допустимых действий
            objectIds: [4] // идентификаторы допустимых объектов
        }
    },
    {
        type: "removeSubject",
        subjectId: 0,
        condition: { 
            subjectIds: [0],// если поле не указано, значит подходит любая сущность
            actionIds: [4],
            objectIds: [4],
        }
    },
    {
        type: "nextEvent",
        eventId: 4,
        condition: {
            actionIds: [4,6,1,2],
            objectIds: [5]
        }
    },    
    {
        type: "nextEvent",
        eventId: 3,
        condition: {
            actionIds: [1,4],
            objectIds: [7,8]
        }
    },
    {
        type: "nextEvent",
        eventId: 5,
        condition: {
            actionIds: [5,6],
            objectIds: [8]
        }
    },
    {
        type: "nextEvent",
        eventId: 4,
        condition: {
            actionIds: [4,6,1],
            objectIds: [12]
        }
    }
]

