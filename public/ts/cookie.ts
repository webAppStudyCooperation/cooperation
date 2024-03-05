import { User } from "./models/back/user.js";

interface Options {
  [key: string]: string | Date | number | boolean;
}

class CookieManager {
  expireTime = 1 * 24 * 60 * 60 * 1000;

  makeUserIdExpried() {
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

  getAllCookie(): Options {
    let result: Options = {};
    const arr = document.cookie.split(";");
    for (let index in arr) {
      const tmp = arr[index].split("=");
      result[tmp[0]] = tmp[1];
    }
    return result;
  }

  getCookie(name: string) {
    // let matches = document.cookie.match(
    //   new RegExp(
    //     "(?:^|; )" +
    //       name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
    //       "=([^;]*)"
    //   )
    // );
    // return matches ? decodeURIComponent(matches[1]) : undefined;
    const options = this.getAllCookie();
    for (let key in options) {
      if (key === name) return options[key];
    }
    return undefined;
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

  getUserFromCookie(): User | undefined {
    const userId = this.getCookie("userId");
    if (typeof userId != "string") return undefined;

    return new User(userId, "", "", 0);
  }
}

export const cookieManager = new CookieManager();
