// import { mainContentElem } from "../../board";
// import { DateString } from "../back/boards";
// import { BoardItem } from "../back/boards";
// import { User } from "../back/user";

// class InputFeedForm {
//   inputFeedForm: HTMLFormElement = document.createElement("form");
//   inputContent: HTMLInputElement = document.createElement("input");
//   inputTitle: HTMLInputElement = document.createElement("input");
//   innerAddBtn: HTMLButtonElement = document.createElement("button");

//   /** 피드 작성 폼 생성 */
//   constructor() {
//     this.innerAddBtn.innerText = "피드 등록";
//     this.inputFeedForm.appendChild(this.inputContent);
//     this.inputFeedForm.appendChild(this.inputTitle);
//     this.inputFeedForm.appendChild(this.innerAddBtn);
//     this.innerAddBtn.addEventListener("click", (e: Event) =>
//       this.submitNewFeed(e, this.inputContent, this.inputTitle)
//     );
//   }

//   returnForm() {
//     return this.inputFeedForm;
//   }

//   show() {
//     mainContentElem?.appendChild(this.returnForm());
//   }

//   hide() {
//     mainContentElem?.removeChild(this.returnForm());
//   }

//   /**피드 등록*/
//   private submitNewFeed(
//     e: Event,
//     inputContent: HTMLInputElement,
//     inputTitle: HTMLInputElement
//   ) {
//     e.preventDefault();
//     console.log(inputContent.value + "\n" + inputTitle);
//     this.hide();

//     this.postNewFeed();
//     this.inputFeedForm.reset();
//   }

//   /**
//    * BoardItem 생성 api 아래 형식으로 요청 가능
//    * body: {
//           "boardId": 0,
//           "title": "testTitle",
//           "content": "dsfdsfdsfsdf",
//           "creationDate": "2021:07:29 00:00:00",
//           "modifyDate": "2021:07:29 00:00:00",
//           "password": null,
//           "secret": 0,
//           "createUser": {
//               "id": "test",
//               "name": "testName",
//               "nickName": "testNickNAme",
//               "familyId": 0
//           },
//           "comments": []
//       }
//    */

//   /**피드 등록시 서버에게 post 요청 */
//   private postNewFeed() {
//     //str date
//     let testDate = new DateString(null, new Date());
//     const testUser = new User("Test1", "TESTNAME", "TESTNICKNAME", 0);

//     console.log(new Date());
//     // 임시 testData, 로그인 구현 이후 수정 필요
//     let testData = new BoardItem(
//       feedManager.getFeedNumber() + 1,
//       this.inputTitle.innerText,
//       this.inputContent.innerText,
//       testDate,
//       testDate,
//       null,
//       0,
//       testUser,
//       0
//     );
//     // console.log(data);
//     // fetch(baseURL + "api/boards", {
//     //   method: "POST",
//     //   headers: {
//     //     "Content-Type": "application/json",
//     //   },
//     //   body: JSON.stringify({ familyId: familyId }),
//     // });
//   }
// }

// export { InputFeedForm };
