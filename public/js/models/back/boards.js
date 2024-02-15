export class SecretNumber {
    constructor(secret) {
        this.valid = 0 <= secret && secret <= 1;
        this.value = secret;
    }
    getSecret() {
        if (this.valid) {
            return this.value;
        }
        else {
            return 0;
        }
    }
}
export class DateString {
    constructor(str, date) {
        if (date != null) {
            this.date = date;
            this.valid = true;
        }
        else {
            try {
                if (str == null) {
                    throw Error;
                }
                this.date = new Date(str);
                this.valid = true;
            }
            catch (_a) {
                this.valid = false;
                this.date = null;
            }
        }
    }
    getDateString() {
        // todo 날짜 파싱 로직 다시 만들기
        return "2000-01-23 00:00:00";
        // if(this.date == null) {
        //     return null
        // } else {
        //     return this.date.getFullYear() + "-"
        //      + this.date.getMonth + "-"
        //      + this.date.getDate + " "
        //      + this.date.getHours() + ":"
        //      + this.date.getMinutes() + ":"
        //      + this.date.getSeconds()
        // }
    }
}
export class BoardItem {
    constructor(boardId, title, content, creationDate, modifyDate, password, secret, createUser, familyId) {
        this.boardId = boardId;
        this.title = title;
        this.content = content;
        this.creationDate = creationDate;
        this.modifyDate = modifyDate;
        this.password = password;
        this.secret = new SecretNumber(secret);
        this.createUser = createUser;
        this.comments = [];
        this.familyId = familyId;
    }
}
