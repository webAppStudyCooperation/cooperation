import { BoardComment } from "./comments";
import { User } from "./user";

class SecretNumber {
    valid: boolean
    value: number
    constructor(secret: number) {
        this.valid = (0 <=secret && secret <= 1);
        this.value = secret;
    }
}

export class DateString {
    valid: boolean
    date: string
    constructor(str: string) {
        const regex = /\d\d-\d\d-\d\d/;
        this.valid = regex.test(str);
        this.date = str;
    }
}

export class BoardItem {
    boardId: number
    title: string
    content: string
    creationDate: DateString
    modifyDate: DateString
    password: string | null
    secret: number
    createUser: User | null
    comments: BoardComment[]

    constructor(
        boardId: number,
        title: string,
        content: string,
        creationDate: DateString,
        modifyDate: DateString,
        password: string | null,
        secret: number,
        createUser: User,
    ) {
        this.boardId = boardId
        this.title = title
        this.content = content
        this.creationDate = creationDate
        this.modifyDate = modifyDate
        this.password = password
        this.secret = secret
        this.createUser = createUser
        this.comments = []
    }
}