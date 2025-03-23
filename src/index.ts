import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import AuthRoutes from "./routes/authRoutes";
import conversationsRoutes from "./routes/conversationsRoutes";
import messagesRoutes from './routes/messagesRoutes';
import { saveMessage } from './controllers/messagesController';
import { error } from 'console';

const app = express();
const server = http.createServer(app)
app.use(json());
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

app.use('/auth', AuthRoutes);
app.use('/conversations', conversationsRoutes);
app.use('/messages', messagesRoutes)

io.on('connection', (socket) => {
  console.log('User connected : ', socket.id)

  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId)
    console.log('User joined conversation : '+conversationId);
  })

  socket.on('sendMessage', async (message) => {
    const {conversationId, senderId, content} = message;

    try{
      const sevedMessage = await saveMessage(conversationId, senderId, content);
      console.log('sendMessage : ');
      console.log(sevedMessage);
      io.to(conversationId).emit('newMessage', sevedMessage);

      io.emit('conversationUpdated', {
        conversationId,
        lastMessage: sevedMessage.content,
        lastMessageTime: sevedMessage.created_at,

      })
    } catch (err) {
      console.error('Failed to save message:', error)
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected: ', socket.id);
  })
})

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});