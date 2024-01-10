class SecretNumber {
    constructor(secret) {
        this.valid = 0 <= secret && secret <= 1;
        this.value = secret;
    }
}
export class DateString {
    constructor(str) {
        const regex = /\d\d-\d\d-\d\d/;
        this.valid = regex.test(str);
        this.date = str;
    }
}
export class BoardItem {
    constructor(boardId, title, content, creationDate, modifyDate, password, secret, createUser) {
        this.boardId = boardId;
        this.title = title;
        this.content = content;
        this.creationDate = creationDate;
        this.modifyDate = modifyDate;
        this.password = password;
        this.secret = secret;
        this.createUser = createUser;
        this.comments = [];
    }
}
