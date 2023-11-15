import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set) => ({
      tasks: [],
      images: [],
      addTaskInfo: (data) => {
        set((state) => ({ tasks: [...state.tasks, data] }));
        // set({ tasks: data });
      },
      updateTask: (data) => {
        set({ tasks: data });
      },
      completeTask: (data) => {
        set({ tasks: data });
      },
      deleteTask: (data) => {
        set({ tasks: data });
      },
      getImages: (image) => {
        set({ images: image });
      },
    }),
    {
      name: "userStore",
      getStorage: () => localStorage,
    }
  )
);
