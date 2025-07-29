import { addTodosData,fetchTodos,deleteTodosbyId,updatedTodos } from '../services/todosService.js';
import sessionStore from '../utils/sessionStore.js';

// Parse cookies from headers
function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach(cookie => {
    const [key, value] = cookie.trim().split('=');
    cookies[key] = value;
  });
  return cookies;
}

export function addTodos(req, res) {
  const cookies = parseCookies(req.headers.cookie);
  //console.log('Parsed cookies:', cookies);

  const sessionId = cookies.sessionId;
  //console.log('Session ID:', sessionId);

  const session = sessionStore.getUserFromSession(sessionId);
  //console.log('Session:', session);

  sessionStore.printSessions(); // ✅ call from sessionStore singleton

  const userId = session?.userId;
  //console.log('userId:', userId);

  if (!userId) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized: No valid session' }));
    return;
  }

  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', async () => {
    try {
      const { task, title } = JSON.parse(body);

      const data = await addTodosData(userId, task, title);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Todos Data Added Successfully', data }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Failed to add todo',
        message: err.message,
      }));
    }
  });
}




export async function getTodos(req, res) {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies.sessionId;

    if (!sessionId) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Unauthorized - No session found' }));
    }

    const user = sessionStore.getUserFromSession(sessionId);
    
    console.log(sessionId,"sess");
    console.log(user,"ddd");

    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Unauthorized - Invalid session' }));
    }

    const todos = await fetchTodos(user.userId); // Fetch todos only for this user

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(todos));
    
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}



export async function putTodos(req, res, id) {
  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', async () => {
    try {
      const data = JSON.parse(body);

      const updated = await updatedTodos(id, data); // use id from URL

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updated));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  });
}


export async function deleteTodos(req,res,id){
    try{
        const todos=await deleteTodosbyId(id);
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify("Delete Succesfully",todos));

    }catch(error){
        console.error('Error fetching todos:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}
