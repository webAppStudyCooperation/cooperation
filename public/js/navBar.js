"use strict";
/** navBar click Event 발생할때마다 검사
 * 현재 누른 버튼 != 이전에 누른 버튼
 * 현재 누른 버튼 true, 이외의 모든 버튼 false
 *
 * 현재 누른 버튼 == 이전에 누른 버튼
 * return 0
 */
const btnList = document.getElementsByClassName("menuBarBtn");
for (let i = 0; i < btnList.length; i++) {
    document
        .getElementsByClassName("menuBarBtn")[i].addEventListener("clicked", navBarClickEvent);
}
function navBarClickEvent() {
}
