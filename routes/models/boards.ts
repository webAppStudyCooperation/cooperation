import { BoardComment } from "./comments";
import { User } from "./user";

export class SecretNumber {
    valid: boolean
    value: number
    constructor(secret: number) {
        this.valid = (0 <=secret && secret <= 1);
        this.value = secret;
    }
    getSecret(): number {
        if(this.valid) {
            return this.value
        } else {
            return 0
        }
    }
}

export class DateString {
    valid: boolean
    date: Date | null
    constructor(str: string | null, date: Date | null) {
        if(date != null ) {
            this.date = date
            this.valid = true
        } else {
            try {
                if(str == null) {
                    throw Error
                }
                this.date = new Date(str)
                this.valid = true
            } catch {
                this.valid = false
                this.date = null
            }
        }
    }

    getDateString(): string | null { 
        if(this.date == null) {
            return null
        } else {
            return this.date.getFullYear() + ":"
             + this.date.getMonth + ":"
             + this.date.getDate + " "
             + this.date.getHours() + ":"
             + this.date.getMinutes() + ":"
             + this.date.getSeconds()
        }
    }
}

export class BoardItem {
    boardId: number
    title: string
    content: string
    creationDate: DateString
    modifyDate: DateString
    password: string | null
    secret: SecretNumber
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
        this.secret = new SecretNumber(secret)
        this.createUser = createUser
        this.comments = []
    }
}