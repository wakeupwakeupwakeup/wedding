import type { App } from 'vue'
import scrollAnimation from './scrollAnimation'

export default {
  install(app: App) {
    app.directive('scroll-animation', scrollAnimation)
  },
}

export { scrollAnimation }
