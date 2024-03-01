interface Options {
  [key: string]: string | Date | number | boolean;
}

function cookieExpireTime() {
  //   const expireTime = 1 * 24 * 60 * 60 * 1000;
  const expireTime = 5 * 1000;
  return expireTime;
}

export function setCookie(name: string, value: string, options: Options = {}) {
  const expireTime = cookieExpireTime;

  let date = new Date();

  date.setTime(date.getTime() + expireTime()); // 하루 뒤로 설정
  // date.setTime(date.getTime() + 60 * 1000); // test 30초 뒤 삭제

  options = {
    expires: date.toUTCString(),
    path: "/", // 경로 지정
    ...options, // 아규먼트로 옵션을 넘겨줬을경우 전개연산자로 추가 갱신
  };

  let updatedCookie =
    encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;

    let optionValue = options[optionKey];
    if (optionValue !== true) {
      // secure
      // http를 통한 정보 유출 방지

      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie; // 새로 갱신
}

function getCookie(name: string) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function checkCookieExpiration() {
  const cookieValue = getCookie("userId");
  alert(cookieValue);

  if (cookieValue) {
    var expirationTime = parseInt(cookieValue); // 쿠키의 만료 시간(일단위로 저장되어 있다고 가정)
    var currentTime = new Date().getTime();

    if (currentTime >= expirationTime) {
      // 쿠키가 만료되었을 때 할 작업 수행
      // 예: 다른 쿠키 설정, 사용자 경고, 로그아웃 등
      alert("쿠키가 만료되었습니다!");
    }
  }
}

// 페이지 로드 시 체크
window.onload = function () {
  checkCookieExpiration();
};

// 쿠키 만료 시간 시 체크
setInterval(checkCookieExpiration, cookieExpireTime());
