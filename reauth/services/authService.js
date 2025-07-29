import bcrypt from 'bcrypt';
import prisma from '../db/prismaClient.js';


export async function registerUser(name,email,password) {
    const hashed=await bcrypt.hash(password,10);
    return await prisma.users.create({
        data: {name,email,password:hashed}
    });
    
}

export async function loginUser(email,password){
     const user = await prisma.users.findUnique({
    where: { email },
  });
    if(!user) throw new Error('User Not Found');
    const match=await bcrypt.compare(password,user.password);
    if(!match) throw new Error('Invalid Password');
    return user;
}