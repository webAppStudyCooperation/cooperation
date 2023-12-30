class SecretNumber {
    valid: boolean
    value: number
    constructor(secret: number) {
        this.valid = (0 <=secret && secret <= 1);
        this.value = secret;
    }
}

class DateString {
    valid: boolean
    date: string
    constructor(str: string) {
        const regex = /\d\d-\d\d-\d\d/;
        this.valid = regex.test(str);
        this.date = str;
    }
}

interface IBoardItem {
    boardId: number
    title: string
    content: string
    creationDate: DateString
    modifyDate: DateString
    password: string
    secret: number
    createUserId: string
}

export {
    DateString,
    SecretNumber,
    IBoardItem
}