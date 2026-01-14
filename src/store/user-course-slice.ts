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
    name: string | null;
    slug: string | null;
  };
}

const initialState: CourseState = {
  pagination: { page: 1, size: 12 },
  filters: { categoryIds: [], search: "" },
  currentCourse: { name: null, slug: null }
};

const userCourseSlice = createSlice({
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
    setCurrentCourse: (state, action: PayloadAction<{ name: string; slug: string } | null>) => {
      state.currentCourse = action.payload ?? { name: null, slug: null };
    }
  }
});

export const { setPage, setCategoryFilter, setCurrentCourse, setSearch } = userCourseSlice.actions;
export default userCourseSlice.reducer;