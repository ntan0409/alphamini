import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CourseState {
  pagination: {
    page: number;
    size: number;
  };
  filters: {
    categoryIds: string[];
    search: string;
  };
  currentCourse: {
    name?: string;
    slug?: string;
    id?: string
  };
}

const initialState: CourseState = {
  pagination: { page: 1, size: 12 },
  filters: { categoryIds: [], search: "" },
  currentCourse: {}
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string[]>) => {
      state.filters.categoryIds = action.payload;
      state.pagination.page = 1;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      console.log("Setting search to:", action.payload);

      state.filters.search = action.payload;
      state.pagination.page = 1;
    },
    setCurrentCourse: (state, action: PayloadAction<{ name?: string; slug?: string, id?: string }>) => {
      state.currentCourse = action.payload ?? { name: null, slug: null };
    }
  }
});

export const { setPage, setCategoryFilter, setSearch, setCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;