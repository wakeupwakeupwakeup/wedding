import type { Directive, DirectiveBinding } from 'vue'

interface ScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  delay?: number
  duration?: number
  once?: boolean
  animation?: string
}

// Расширяем HTMLElement для хранения observer
interface HTMLElementWithObserver extends HTMLElement {
  _scrollAnimation?: IntersectionObserver
}

const defaultOptions: ScrollAnimationOptions = {
  threshold: 0.1,
  rootMargin: '0px',
  delay: 0,
  duration: 800,
  once: true,
  animation: 'fade-in',
}

const scrollAnimation: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const options = { ...defaultOptions, ...(binding.value || {}) }

    // Добавляем начальные стили без влияния на скролл
    el.style.opacity = '0'
    el.style.transition = `opacity ${options.duration}ms ease ${options.delay}ms, transform ${options.duration}ms ease ${options.delay}ms`

    // Важно: не добавляем overflow: hidden, чтобы не создавать скроллы

    // Используем transform вместо margin/padding для анимаций
    if (options.animation === 'fade-in') {
      el.style.transform = 'translateY(20px)'
    } else if (options.animation === 'fade-in-left') {
      el.style.transform = 'translateX(-20px)'
    } else if (options.animation === 'fade-in-right') {
      el.style.transform = 'translateX(20px)'
    } else if (options.animation === 'zoom-in') {
      el.style.transform = 'scale(0.95)'
    }

    // Используем will-change только во время анимации
    // для оптимизации производительности
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Добавляем will-change перед анимацией
            el.style.willChange = 'opacity, transform'

            setTimeout(() => {
              el.style.opacity = '1'
              el.style.transform = 'translate(0) scale(1)'

              // Удаляем will-change после завершения анимации
              setTimeout(() => {
                el.style.willChange = 'auto'
              }, options.duration)
            }, 50)

            if (options.once) {
              observer.unobserve(el)
            }
          } else if (!options.once) {
            el.style.opacity = '0'

            if (options.animation === 'fade-in') {
              el.style.transform = 'translateY(20px)'
            } else if (options.animation === 'fade-in-left') {
              el.style.transform = 'translateX(-20px)'
            } else if (options.animation === 'fade-in-right') {
              el.style.transform = 'translateX(20px)'
            } else if (options.animation === 'zoom-in') {
              el.style.transform = 'scale(0.95)'
            }
          }
        })
      },
      {
        threshold: options.threshold,
        rootMargin: options.rootMargin,
      },
    )

    observer.observe(el)

    // Сохраняем observer для возможности очистки
    const element = el as HTMLElementWithObserver
    element._scrollAnimation = observer
  },

  unmounted(el: HTMLElement) {
    // Очистка стилей при удалении элемента
    el.style.willChange = 'auto'
    el.style.transform = ''
    el.style.opacity = ''
    el.style.transition = ''

    // Отключаем observer при удалении элемента
    const element = el as HTMLElementWithObserver
    if (element._scrollAnimation) {
      element._scrollAnimation.disconnect()
    }
  },
}

export default scrollAnimation
