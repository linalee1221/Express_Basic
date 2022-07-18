const express = require("express");
const path = require("path");

// express 웹서버 정의
const app = express();

// 포트 설정 : 3000
app.set("port", process.env.PORT || 3000);

// 모든 요청에서 미들웨어 실행
// next 미들웨어 : 다음 미들웨어로 넘기는 기능이 있는 함수
app.use((req, res, next) => {
    console.log("모든 요청에 다 실행됩니다.")
    next();
})

// app.get(라우터, 미들웨어1, 미들웨어2)
app.get("/", (req, res, next)=>{
    console.log("get 라우터는 / 요청에 대해서만 실행됩니다.")
    next();
}, (req, res) => {
    throw new Error("에러는 에러 처리 미들웨어로 갑니다.")
});

// err : 에러처리 미들웨어, 반드시 매개변수가 4개가 되어야 합니다.
app.use((err, req, res, next)=>{
    console.error(err);
    res.status(500).send(err.message)
})





// get 메서드로 텍스트 또는 파일 실행
app.get("/", (req, res) => {
    // html 파일 읽기 : / 라우터에서 실행
    res.sendFile(path.join(__dirname, "/index.html"));
});

// 웹서버 계속 실행(위에서 정의한 포트로 계속 대기)
app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기중");
})