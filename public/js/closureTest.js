import { baseURL } from "./config.js";
function getDataList() {
    // let data: Promise<BoardItem>;
    return (fetch(baseURL + "api/boards")
        .then((response) => response.json().then((json) => {
        return json;
    }))
        // data는 함수이다.
        .catch((error) => console.error(error)));
}
let test1 = getDataList();
test1.then((data) => console.log(data));
/** class
 * json을 넣었을때 format과 일치하지 않으면 에러처리
 */
