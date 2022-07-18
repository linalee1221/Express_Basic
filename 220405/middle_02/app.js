const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const morgan = require("morgan");
// 파일업로드를 위한 미들웨어
const multer = require("multer")

// dotenv 정의
// .env 파일을 사용할 수 있게 해줌
dotenv.config();

// express 웹서버 정의
const app = express();

// morgan 정의
app.use(morgan("dev"));

// 포트 설정 : 3000
app.set("port", process.env.PORT || 3000);

// static() 미들웨어 : express 내장된 미들웨어
// 정적인 파일들이 있는 실제 경로와 라우터를 연결해주는 미들웨어
// 1st 매개변수 : 들어오는 라우터(웹브라우저url)
// 2st 매개변수 : 실제 로컬pc경로(public)
app.use("/", express.static(path.join(__dirname, "public")));

// body-parser 미들웨어 : express 내장된 미들웨어
// json() : json 파일을 해석해서 객체로 전달하는 미들웨어
app.use(express.json())
// URL주소형식(params, querystring 형식)을 해석해서 객체로 전달하는 미들웨어
app.use(express.urlencoded({ extended: false }));

// 쿠키 미들웨어
// 쿠키를 해석해서 req.cookies 객체로 만들어 주는 미들웨어
// 매개변수 : 비밀키가 .env파일에 있음
app.use(cookieParser(process.env.COOKIE_SECRET));

// 세션 미들웨어 정의
// 로그인 정보 등의 이유로 임시적으로 저장할 목적으로 사용
// 세션 정보 : req.sesstion 객체에 저장
app.use(sesstion({
    resave: false,
    // 세션에 저장할 내역이 없어도 처음부터 세션을 생성할 지 설정
    saveUninitialized: false,
    // 세션 쿠키를 클라이언트 전송
    secret: process.env.COOKIE_SECRET, 
    // 세션 쿠키
    cookie: {
       // 웹브라우저에서만 볼 수 있게 설정
       httpOnly: true,
       // https 환경 외에서 볼 수 있게 설정
       secure: false 
    },
    name: "session-cookie"
    
}))



// 모든 요청에서 미들웨어 실행
// next 미들웨어 : 다음 미들웨어로 넘기는 기능이 있는 함수
app.use((req, res, next)=>{
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
// get 메서드로 텍스트 또는 파일 실행
app.get("/", (req, res) => {
    // html 파일 읽기 : / 라우터에서 실행
    res.sendFile(path.join(__dirname, "/index.html"));
});

// 웹서버 계속 실행(위에서 정의한 포트로 계속 대기)
app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기중");
})