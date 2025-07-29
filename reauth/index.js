import http from 'http';
import dotenv from 'dotenv';
import { handleAuthRoutes,handleTodoRoutes } from './routes/authRoutes.js';


dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(async (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST,PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  res.setHeader('Content-Type', 'application/json');

  if (req.url.startsWith('/register') || req.url.startsWith('/login') || req.url.startsWith('/logout')) {
        return handleAuthRoutes(req, res);
  }

  if(req.url.startsWith('/todos')){
    return handleTodoRoutes(req,res);
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
