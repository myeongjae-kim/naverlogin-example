import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();

const client_id = 'LmP8wBVJASDzGzzDQJBz';
const client_secret = 'P1551MIFRr';
const state = "RAMDOM_STATE";
const redirectURI = encodeURI("http://localhost:8080/callback");
var api_url = "";

app.get('/naverlogin', (req: Request, res: Response) => {
  api_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirectURI}&state=${state}`;
  res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
  res.end(`<a href='${api_url}'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>`);
});

app.get('/callback', (req: Request, res: Response) => {
  var code = req.query.code;
  var state = req.query.state;
  api_url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirectURI}&code=${code}&state=${state}`;

  axios.get(api_url, {
    headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
  })
    .then(r => axios.get("https://openapi.naver.com/v1/nid/me", {
      headers: { 'Authorization': `Bearer ${r.data.access_token}` }
    }))
    .then(r => res.json(r.data))
});

app.listen(8080, () => {
  console.log('http://localhost:8080/naverlogin app listening on port 8080!');
});
