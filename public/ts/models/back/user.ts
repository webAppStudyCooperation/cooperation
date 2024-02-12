import { json } from "stream/consumers";

export class User {
  id: string;
  name: string;
  nickName: string;
  familyId: number;

  constructor(id: string, name: string, nickname: string, familyId: number) {
    this.id = id;
    this.name = name;
    this.nickName = nickname;
    this.familyId = familyId;
  }
}

export function makeJoinUserJsonStr(
  userId: string,
  userPassword: string,
  name: string,
  nickname: string
) {
  return JSON.stringify({
    userId: userId,
    userPassword: userPassword,
    name: name,
    nickname: nickname,
    familyId: 0,
  });
}

export function makeReSignUserJsonStr(userId: string, userPassword: string) {
  return JSON.stringify({
    userId: userId,
    userPassword: userPassword,
  });
}
