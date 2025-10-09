import { createSlice } from "@reduxjs/toolkit";
import { MODAL_STATE } from "../../common/states";

interface ConfigurationState {
  [MODAL_STATE.UPDATE_USER_MODAL]: boolean;
  product: null; // Replace `any` with the actual type of your product if you have one
}

const initialState: ConfigurationState = {
  [MODAL_STATE.UPDATE_USER_MODAL]: false,
  product: null,
};

const slice = createSlice({
  name: "configuration",
  initialState,
  reducers: {
    toggleModal: (state, { payload: modalState }) => {
      switch (modalState) {
          case MODAL_STATE.UPDATE_USER_MODAL:
          state[MODAL_STATE.UPDATE_USER_MODAL] = !state[MODAL_STATE.UPDATE_USER_MODAL];
          break;     
        default:
          break;
      }
    },
  },
});

export const { toggleModal } = slice.actions;
export const selectConfiguration = (state: {configuration: ConfigurationState}) => state.configuration;
export default slice.reducer;
