import { createContext } from 'react';
import { io } from 'socket.io-client';

// const URL = 'http://localhost:4000';
const URL = process.env.REACT_APP_BACKEND;

export const socket = io(URL, {
    autoConnect: false,
    query: 'roomId=Hello'
});
export const SocketContext = createContext();

// socket.on('awesome', () => {
//     console.log("Successfully connected on client side")
//     enqueueSnackbar('Successfully connected', {variant:'success'})
// })

// On event of 'users', Get all users currently connected to display 
// socket.on('users', (users) => {
//     console.log("CollabGroup ", users)
// })

// socket.on("user connected", (user) => {
//     console.log("Another user connected ")
//     enqueueSnackbar('Another user connected', {variant:'info'})

// });

// socket.on("joined room", () => {
//     console.log("Joined room")
//     enqueueSnackbar('joined room', {variant:'info'})

// });
