import { createSlice } from '@reduxjs/toolkit';

export const DataSlice = createSlice({
  name: 'dataSlice',
  initialState: {
    logs: [],
  },
  reducers: {
    updateLogs: (state, actions) => {
      state.logs = actions.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateLogs,
} = DataSlice.actions

export default DataSlice.reducer