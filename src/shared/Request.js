import axios from "axios";


const instance = axios.create({
	baseURL: "http://13.124.63.103/api" // 요청을 www.aa.com/user로 보낸다면, www.aa.com까지 기록
});

// 가지고 있는 토큰 넣어주기!
// 로그인 전이면 토큰이 없으니 못 넣어요.
// 그럴 땐 로그인 하고 토큰을 받아왔을 때 넣어줍시다.
instance.defaults.headers.common["authorization"] = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTA2MjdkZDcyNzkzZjEyMzZlYTY0NGIiLCJpYXQiOjE2Mjc5MDE4Njl9.N0kPztB_ihWCIZx3TC3gvpqKKGUdbfqrG_T0E9etX3s"; 

export default instance;