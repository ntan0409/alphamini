import { configureStore } from '@reduxjs/toolkit'
import robotReducer from './robot-slice'
import courseReducer from './course-slice'
import userCourseReducer from './user-course-slice'
import notificationReducer from './notification-slice'

export const store = configureStore({
  reducer: {
    robot: robotReducer,
    course: courseReducer,
    userCourse: userCourseReducer
    ,notification: notificationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch