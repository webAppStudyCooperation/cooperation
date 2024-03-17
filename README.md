# cooperation

### router정의 컨벤션
1. /routes 폴더 안에 js파일로 method 정의
2. app.js 파일에 router변수 정의
3. html파일 등은 /views 폴더에 정의
4. js, 이미지 등 client에게 제공하는 파일들은 /public 폴더에 정의

### 서버 실행 절차
1. ```cd 프로젝트 경로```
2. ```(sudo) npm install (정의된 패키지 설치)```
3. ```npm start```
4. ```브라우저에 "localhost:3000" 으로 진입```
5. ```http://1.230.253.190:9280/ 으로 접근가능```


### socket.io 모듈 관련 오류 발생시  
1. sudo npm install socket.io
2. sudo npm link socket.io  


### 모바일 빌드의 경우 androidStudio, Xcode, adb, 환경변수 등이 설정되어 있어야 테스트 가능함

### 모바일 관련 테스트 (RN)
1. cd ./RN/cooperation
2. npm install
3. npm start


### mac/linux에서 권한 문제 발생시
> sudo chmod -R 777 ./  
> 으로 모든 파일에 대한 일기/쓰기/실행 권한 추가  