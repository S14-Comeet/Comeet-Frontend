import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    appName: 'Comeet',
    initializedAt: new Date().toISOString()
  }),
  getters: {
    welcomeMessage: (state) => `환영합니다, ${state.appName} 프론트 구조가 준비되었습니다.`
  }
});

