import prisma from '../db/prismaClient.js';

export async function addTodosData(userId, task, title) {
    return await prisma.todo.create({
  data: {
    title: title,
    task: task,
    user: {
      connect: {
        id: userId,  // ✅ just the user ID
      }
    }
  }
});
}


export async function fetchTodos(userId) {
  return await prisma.todo.findMany({
    where: { userId }, // Filter todos by the user's ID
    orderBy: { createdAt: 'desc' } // Optional: sort by most recent
  });
}


export async function updatedTodos(id, data) {
  return await prisma.todo.update({
    where: { id: parseInt(id) }, // ID must be an integer
    data: {
      status: data.status,       // Must be one of: 'PENDING', 'IN_PROGRESS', 'COMPLETED'
    },
  });
}

export async function deleteTodosbyId(id){
   return await prisma.todo.delete({
    where:{id:parseInt(id)}
   })
}