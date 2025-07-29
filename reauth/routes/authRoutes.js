import { handleRegister,handleLogin,handleLogOut} from '../controllers/authController.js';
import { addTodos,getTodos,putTodos,deleteTodos} from '../controllers/todosController.js';

export async function handleAuthRoutes(req,res){
        if (req.method === 'POST' && req.url === '/register'){
            return handleRegister(req,res);
        }
        else if(req.method==='POST' && req.url === '/login'){
            return handleLogin(req,res);
        }
         else if(req.method==='POST' && req.url === '/logout'){
            return handleLogOut(req,res);
        }
}

export async function handleTodoRoutes(req, res) {
  const method = req.method;
  const urlParts = req.url.split('/'); // ['', 'todos', '1']

  // POST /todos
  if (method === 'POST' && req.url === '/todos') {
    return addTodos(req, res);
  }

  // GET /todos
  if (method === 'GET' && req.url === '/todos') {
    return getTodos(req, res);
  }

  // PUT /todos/:id
  if (method === 'PUT' && urlParts[1] === 'todos' && urlParts[2]) {
    const id = parseInt(urlParts[2]);
    return putTodos(req, res, id);
  }
  
   // DELETE /todos/:id
  if (method === 'DELETE' && urlParts[1] === 'todos' && urlParts[2]) {
    const id = parseInt(urlParts[2]);
    return deleteTodos(req, res, id);
  }
  
 
}
