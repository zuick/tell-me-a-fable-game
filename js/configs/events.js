var events = [
    {
        id: "0",
        title: "",
        description: "История номер 1 или пример события",
        initial: true, // загружаеться в первичный пул
        outcomes: [
            {
                type: "newSubject",
                subjectId: "subjectId",
                condition: {
                    subjectIds: [],
                    objectIds: [],
                    actionIds: []
                }
            },
            {
                type: "nextEvent",
                eventId: "eventId",
                condition: {
                    subjectId: [],
                    objectId: [],
                    actionId: []
                }
            }
        ]
    },
    {
        id: "1",
        title: "",
        description: "История номер 2",
        initial: true,
        outcomes: []
    },
    {
        id: "2",
        title: "",
        description: "История номер 3",
        initial: true,
        outcomes: []
    },
    {
        id: "2",
        title: "",
        description: "Особый случай",
        outcomes: []
    }
];


