import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Notification } from '@/types/notification'

interface NotificationState {
  items: Notification[]
  unreadCount: number
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.items = action.payload
      state.unreadCount = action.payload.filter(n => !n.isRead).length
    },
    addNotification(state, action: PayloadAction<Notification>) {
      const n = action.payload
      const exists = state.items.some(i => i.id === n.id)
      if (!exists) {
        state.items.unshift(n)
        if (!n.isRead) state.unreadCount += 1
      }
    },
    markAsRead(state, action: PayloadAction<string>) {
      const id = action.payload
      const idx = state.items.findIndex(i => i.id === id)
      if (idx !== -1 && !state.items[idx].isRead) {
        state.items[idx].isRead = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    markAllAsRead(state) {
      state.items = state.items.map(i => ({ ...i, isRead: true }))
      state.unreadCount = 0
    },
    clearNotifications(state) {
      state.items = []
      state.unreadCount = 0
    }
  }
})

export const { setNotifications, addNotification, markAsRead, markAllAsRead, clearNotifications } = notificationSlice.actions

export default notificationSlice.reducer
