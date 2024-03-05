export class User {
    constructor(id, name, nickname, familyId) {
        this.id = id;
        this.name = name;
        this.nickName = nickname;
        this.familyId = familyId;
    }
}
export function makeJoinUserJsonStr(userId, userPassword, name, nickname) {
    return JSON.stringify({
        userId: userId,
        userPassword: userPassword,
        name: name,
        nickname: nickname,
        familyId: 0,
    });
}
export function makeReSignUserJsonStr(userId, userPassword) {
    return JSON.stringify({
        userId: userId,
        userPassword: userPassword,
    });
}
