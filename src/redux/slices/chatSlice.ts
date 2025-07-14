import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Participant {
  _id: string;
  FullName: string;
}

interface Message {
  content: string;
  createdAt: string;
  sender: Participant;
}

export interface Chat {
  _id: string;
  participants: Participant[];
  message: Message[];
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  chats: Chat[];
}

const initialState: ChatState = {
  chats: [],
};

const chatSlice = createSlice({
  name: 'chatSlice',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      state.chats.push(action.payload);
    },
    updateChatMessages: (
      state,
      action: PayloadAction<{ chatId: string; messages: Message[] }>
    ) => {
      const { chatId, messages } = action.payload;
      const chat = state.chats.find((c) => c._id === chatId);
      if (chat) {
        chat.message = messages;
        chat.updatedAt = new Date().toISOString();
      }
    },
    removeChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter((c) => c._id !== action.payload);
    },
    clearChats: (state) => {
      state.chats = [];
    },
  },
});

export const {
  setChats,
  addChat,
  updateChatMessages,
  removeChat,
  clearChats,
} = chatSlice.actions;

export default chatSlice.reducer;
