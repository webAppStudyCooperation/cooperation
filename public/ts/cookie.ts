import { User } from "./models/back/user.js";

interface Options {
  [key: string]: string | Date | number | boolean;
}

class CookieManager {
  // user 정보의 존재 여부는 id가 있냐 없냐로만 판단할 것
  userId: string = "userId";
  userName: string = "userName";
  userNickName: string = "userNickName";
  userFamilyId: string = "familyId";

  expireTime = 1 * 24 * 60 * 60 * 1000;

  makeUserIdExpried() {
    console.log("makeUserIdExpried");
    document.cookie = "userId=;max-age=-999";
  }

  setCookie(key: string, value: string, options: Options = {}) {
    let updatedCookie = key + "=" + value + ";";

    options = {
      "max-age": this.expireTime,
      path: "/", // 경로 지정
      ...options, // 아규먼트로 옵션을 넘겨줬을경우 전개연산자로 추가 갱신
    };

    for (let optionKey in options) {
      if (optionKey == "secure") {
        if (options[optionKey]) {
          updatedCookie += optionKey + ";";
        }
      } else {
        updatedCookie += optionKey + "=" + options[optionKey] + ";";
      }
    }
    console.log(updatedCookie);

    document.cookie = updatedCookie; // 새로 갱신
  }

  // getAllCookie(): Map<string, string> {
  //   let result = new Map();
  //   const arr = document.cookie.split(";");
  //   for (let index in arr) {
  //     const tmp = arr[index].split("=");
  //     result.set(tmp[0], tmp[1]);
  //   }
  //   return result;
  // }

  getCookie(name: string) {
    let matches = document.cookie.match(
      new RegExp(
        "(?:^|; )" +
          name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
          "=([^;]*)"
      )
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
    // const map = this.getAllCookie();
    // map.forEach((value, key, mapObject) => {
    //   console.log(key);
    //   console.log(typeof key);
    //   if (key === name) return value;
    // });
    // return undefined;
  }

  checkCookieExpiration(): Boolean {
    const expire = this.getCookie("expire");
    if (expire == undefined) return false;
    if (typeof expire != "string") return false;

    var expirationTime = parseInt(expire); // 쿠키의 만료 시간(일단위로 저장되어 있다고 가정)
    var currentTime = new Date().getTime();
    if (currentTime >= expirationTime) {
      // 쿠키가 만료되었을 때 할 작업 수행
      // 예: 다른 쿠키 설정, 사용자 경고, 로그아웃 등
      alert("쿠키가 만료되었습니다!");
      return false;
    } else {
      return true;
    }
  }
  setUser(user: User) {
    console.log("setUser");
    this.setCookie(this.userId, user.id);
    this.setCookie(this.userName, user.name);
    this.setCookie(this.userNickName, user.nickName);
    this.setCookie(this.userFamilyId, `${user.familyId}`);
  }
  getUserFromCookie(): User | undefined {
    const userId = this.getCookie(this.userId);
    const userName = this.getCookie(this.userName);
    const userNN = this.getCookie(this.userNickName);
    const userFI = this.getCookie(this.userFamilyId);

    // console.log(typeof userId);
    // console.log(typeof userName);
    // console.log(typeof userNN);
    // console.log(typeof userFI);

    // console.log(userId);
    // console.log(userName);
    // console.log(userNN);
    // console.log(userFI);

    const valid =
      typeof userId == "string" &&
      typeof userName == "string" &&
      typeof userNN == "string" &&
      typeof userFI == "string";

    if (!valid) return undefined;

    return new User(userId, userName, userNN, +userFI);
  }
}

export const cookieManager = new CookieManager();
