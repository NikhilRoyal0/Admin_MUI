import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const GameCategorySlice = createSlice({
  name: "GameCategory",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setGameCategoryData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setGameCategoryLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setGameCategoryError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateGameCategory: (state, action) => {
      const updatedGameCategory = action.payload;
      state.data.map((GameCategory) => GameCategory.crId === updatedGameCategory.crId);
    },
    deleteGameCategory: (state, action) => {
      const crIdToDelete = action.payload;
      state.data = state.data.filter((GameCategory) => GameCategory.crId !== crIdToDelete);
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setGameCategoryData,
  setGameCategoryLoading,
  setGameCategoryError,
  updateGameCategory,
  deleteGameCategory,
} = GameCategorySlice.actions;

export const fetchGameCategoryData = () => async (dispatch) => {
  try {
    dispatch(setGameCategoryLoading());
    const response = await axios.get(import.meta.env.VITE_BASE_URL + "client/getGameCategory");
    dispatch(setGameCategoryData(response.data));
  } catch (error) {
    dispatch(setGameCategoryError(error.message));
  }
};

export const AddData = (form) => async () => {
  try {
    const response = await axios.post(import.meta.env.VITE_BASE_URL + 'client/addCategory', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

export const updateGameCategoryData = (crId, data) => async (dispatch) => {
  try {

    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `client/updateCategory/${crId}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const updatedGameCategoryData = response.data;

    dispatch(updateGameCategory(updatedGameCategoryData));

  } catch (error) {
    console.error('Error:', error);
  }
}

export const deleteGameCategoryData = (crId, data) => async (dispatch) => {
  try {

    const response = await axios.delete(
      import.meta.env.VITE_BASE_URL + `client/deleteCategory/${crId}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const deleteGameCategoryData = response.data;

    dispatch(deleteGameCategory(deleteGameCategoryData));

  } catch (error) {
    console.error('Error:', error);
  }
};



export const selectGameCategoryData = (state) => state.GameCategory.data;
export const selectGameCategoryLoading = (state) => state.GameCategory.isLoading;
export const selectGameCategoryError = (state) => state.GameCategory.error;

export default GameCategorySlice.reducer;
