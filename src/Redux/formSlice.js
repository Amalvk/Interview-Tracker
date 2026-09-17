import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebaseConfig';

// 👉 Async middleware to save form data to Firestore
export const saveFormToFirestore = createAsyncThunk(
  'form/saveFormToFirestore',
  async (formData, { rejectWithValue }) => {
    try {
      const now = new Date().toISOString();
      const payload = { ...formData, createdAt: now, updatedAt: now };
      const docRef = await addDoc(collection(db, 'activeInterviews'), payload);
      return { id: docRef.id, ...payload };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 👉 Async middleware to fetch all interviews from Firestore
export const fetchInterviewsFromFirestore = createAsyncThunk(
  'form/fetchInterviewsFromFirestore',
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'activeInterviews'));
      const interviews = [];
      querySnapshot.forEach((doc) => {
        interviews.push({ id: doc.id, ...doc.data() });
      });
      return interviews;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInterviewStatus = createAsyncThunk(
  'form/updateInterviewStatus',
  async ({ id, newStatus, previousStatus }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'activeInterviews', id);
      const updates = { initialStatus: newStatus, updatedAt: new Date().toISOString() };
      if (previousStatus !== undefined) {
        updates.previousStatus = previousStatus;
      }
      await updateDoc(docRef, updates);
      return { id, newStatus, previousStatus };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInterviewForm = createAsyncThunk(
  'form/updateInterviewForm',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'activeInterviews', id);
      const payload = { ...updatedData, updatedAt: new Date().toISOString() };
      await updateDoc(docRef, payload);
      return { id, updatedData: payload };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteInterviewById = createAsyncThunk(
  'form/deleteInterviewById',
  async (id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'activeInterviews', id.nodeId);
      await deleteDoc(docRef);
      return id;  // return the id of the deleted document
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// 👉 Initial state
const initialState = {
  status: 'idle',
  error: null,
  interviewList: [], // 👈 to hold fetched collection data
  fetchStatus: 'idle', // 👈 track fetch status separately
  fetchError: null
};

// 👉 Slice
const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormValues: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetForm: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // 🔸 Save form to Firestore
      .addCase(saveFormToFirestore.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveFormToFirestore.fulfilled, (state, action) => {
        state.status = 'succeeded';
        Object.assign(state, action.payload);
      })
      .addCase(saveFormToFirestore.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // 🔸 Fetch all interviews
      .addCase(fetchInterviewsFromFirestore.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchInterviewsFromFirestore.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.interviewList = action.payload;
      })
      .addCase(fetchInterviewsFromFirestore.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.fetchError = action.payload;
      })

      // 🔸 Update status
      .addCase(updateInterviewStatus.fulfilled, (state, action) => {
        const { id, newStatus, previousStatus } = action.payload;
        const existingInterview = state.interviewList.find(item => item.id === id);
        if (existingInterview) {
          existingInterview.initialStatus = newStatus;
          if (previousStatus !== undefined) {
            existingInterview.previousStatus = previousStatus;
          }
        }
      })

      .addCase(updateInterviewForm.fulfilled, (state, action) => {
        const { id, updatedData } = action.payload;
        const existingInterview = state.interviewList.find(item => item.id === id);
        if (existingInterview) {
          Object.assign(existingInterview, updatedData);
        }
      })
      .addCase(updateInterviewStatus.rejected, (state, action) => {
        state.error = action.payload;
      });


  }
});

export const { setFormValues, resetForm } = formSlice.actions;
export default formSlice.reducer;
