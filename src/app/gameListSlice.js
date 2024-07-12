import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const GameListSlice = createSlice({
  name: "GameList",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setGameListData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setGameListLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setGameListError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateGameList: (state, action) => {
      const updatedGameList = action.payload;
      state.data.map((GameList) => GameList.gameId === updatedGameList.gameId);
    },
    deleteGameList: (state, action) => {
      const gameIdToDelete = action.payload;
      state.data = state.data.filter((GameList) => GameList.gameId !== gameIdToDelete);
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setGameListData,
  setGameListLoading,
  setGameListError,
  updateGameList,
  deleteGameList,
} = GameListSlice.actions;

export const fetchGameListData = () => async (dispatch) => {
  try {
    dispatch(setGameListLoading());
    const response = await axios.get(import.meta.env.VITE_BASE_URL + "client/getAllGames");
    dispatch(setGameListData(response.data));
  } catch (error) {
    dispatch(setGameListError(error.message));
  }
};

export const AddData = (form) => async () => {
  try {
    const response = await axios.post(import.meta.env.VITE_BASE_URL + 'client/addGame', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

export const updateGameListData = (gameId, data) => async (dispatch) => {
  try {

    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `client/updateGame/${gameId}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const updatedGameListData = response.data;

    dispatch(updateGameList(updatedGameListData));

  } catch (error) {
    console.error('Error:', error);
  }
}

export const deleteGameListData = (gameId, data) => async (dispatch) => {
  try {

    const response = await axios.delete(
      import.meta.env.VITE_BASE_URL + `client/deleteGame/${gameId}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const deleteGameListData = response.data;

    dispatch(deleteGameList(deleteGameListData));

  } catch (error) {
    console.error('Error:', error);
  }
};



export const selectGameListData = (state) => state.GameList.data;
export const selectGameListLoading = (state) => state.GameList.isLoading;
export const selectGameListError = (state) => state.GameList.error;

export default GameListSlice.reducer;
