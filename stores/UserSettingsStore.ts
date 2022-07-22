import { computed, makeObservable, observable } from "mobx";
import { TaskWithProject } from "../types";

export const PRIMARY_TASK_KEY = "primaryTask";

export class UserSettingsStore {
  #primaryTaskId = observable.box<TaskWithProject["taskId"] | undefined>();

  constructor() {
    makeObservable(this, {
      primaryTaskId: computed,
    });

    if (typeof window !== "undefined") {
      const persistedAllowance = localStorage.getItem(PRIMARY_TASK_KEY);
      if (persistedAllowance) {
        this.#primaryTaskId.set(parseInt(persistedAllowance));
      }
    }
  }

  get primaryTaskId() {
    return this.#primaryTaskId.get();
  }

  set primaryTaskId(taskId: TaskWithProject["taskId"] | undefined) {
    this.#primaryTaskId.set(taskId);

    if (taskId) {
      localStorage.setItem(PRIMARY_TASK_KEY, taskId + "");
    } else {
      localStorage.removeItem(PRIMARY_TASK_KEY);
    }
  }
}

export const userSettingsState = new UserSettingsStore();
