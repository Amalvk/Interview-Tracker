import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebaseConfig';

export const fetchTodosFromFirestore = createAsyncThunk(
  'todo/fetchTodosFromFirestore',
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'todos'));
      const todos = [];
      querySnapshot.forEach((docSnap) => {
        todos.push({ id: docSnap.id, ...docSnap.data() });
      });
      return todos;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveTodoToFirestore = createAsyncThunk(
  'todo/saveTodoToFirestore',
  async (todoData, { rejectWithValue }) => {
    try {
      const now = new Date().toISOString();
      const payload = { ...todoData, createdAt: now, updatedAt: now };
      const docRef = await addDoc(collection(db, 'todos'), payload);
      return { id: docRef.id, ...payload };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTodoInFirestore = createAsyncThunk(
  'todo/updateTodoInFirestore',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'todos', id);
      const payload = { ...updatedData, updatedAt: new Date().toISOString() };
      await updateDoc(docRef, payload);
      return { id, updatedData: payload };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTodoStatus = createAsyncThunk(
  'todo/updateTodoStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'todos', id);
      const updatedAt = new Date().toISOString();
      await updateDoc(docRef, { status, updatedAt });
      return { id, status, updatedAt };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTodoById = createAsyncThunk(
  'todo/deleteTodoById',
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  todoList: [],
  fetchStatus: 'idle',
  fetchError: null,
  error: null,
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosFromFirestore.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchTodosFromFirestore.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.todoList = action.payload;
      })
      .addCase(fetchTodosFromFirestore.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.fetchError = action.payload;
      })

      .addCase(saveTodoToFirestore.fulfilled, (state, action) => {
        state.todoList.push(action.payload);
      })
      .addCase(saveTodoToFirestore.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateTodoInFirestore.fulfilled, (state, action) => {
        const { id, updatedData } = action.payload;
        const existing = state.todoList.find((t) => t.id === id);
        if (existing) Object.assign(existing, updatedData);
      })
      .addCase(updateTodoInFirestore.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateTodoStatus.fulfilled, (state, action) => {
        const { id, status, updatedAt } = action.payload;
        const existing = state.todoList.find((t) => t.id === id);
        if (existing) {
          existing.status = status;
          existing.updatedAt = updatedAt;
        }
      })
      .addCase(updateTodoStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteTodoById.fulfilled, (state, action) => {
        state.todoList = state.todoList.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTodoById.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default todoSlice.reducer;
