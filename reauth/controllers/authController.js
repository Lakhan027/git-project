import {registerUser,loginUser} from '../services/authService.js';
import sessionStore  from '../utils/sessionStore.js';


export function handleRegister(req,res){
        let body='';
        req.on('data',chunk=>body+=chunk);
        req.on('end', async ()=>{
        const {name,email,password}=JSON.parse(body);
        try{
            const user=await registerUser(name,email,password);
            res.writeHead(201);
            res.end(JSON.stringify({message:'User registered',user}));
        }catch(err){
            res.writeHead(400);
            res.end(JSON.stringify({error: err.message}));
        }
});
}

export function handleLogin(req,res){
         let body='';
            req.on('data',chunk=>body+=chunk);
            req.on('end',async()=>{
                const {email,password}=JSON.parse(body);
                try{
                    const user=await loginUser(email,password);
                    const sessionId = sessionStore.createSession(user.id, user.name); // create session here

                     // Set the sessionId cookie
                    res.setHeader('Set-Cookie', [`sessionId=${sessionId}; HttpOnly; Path=/`,`userName=${encodeURIComponent(user.name)}; Path=/`]);
                    res.writeHead(200);
                    res.end(JSON.stringify({ message: 'Login successful', sessionId }));
                }catch(err){
                      res.writeHead(401);
                    res.end(JSON.stringify({error: err.message}));
                }
            })

}

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach(cookie => {
    const [key, value] = cookie.trim().split('=');
    cookies[key] = value;
  });
  return cookies;
}

export function handleLogOut(req,res){

const cookies = parseCookies(req.headers.cookie);
const sessionId = cookies.sessionId;
//const userName  = cookies.userName;
console.log(sessionId,"this sessioID")
if (sessionId) {
    sessionStore.destroySession(sessionId);
    
    // Clear the cookie from browser
    res.setHeader('Set-Cookie', [
      'sessionId=; HttpOnly; Path=/; Max-Age=0',
      'userName=; HttpOnly; Path=/; Max-Age=0',
    ]);
    res.end(JSON.stringify({ message: 'Logout successful' }));
  } else {
     res.end(JSON.stringify({ error: 'No session found' }));
  }  

}
