<script setup lang="ts">
import PageArrow from '@/components/atoms/PageArrow.vue'
import IconArrowDown from '@/components/icons/IconArrowDown.vue'
import IconArrowRight from '@/components/icons/IconArrowRight.vue'
import IconTelegram from '@/components/icons/IconTelegram.vue'
import IconPeople from '@/components/icons/IconPeople.vue'
import IconCall from '@/components/icons/IconCall.vue'
import { ref, onMounted, onUnmounted } from 'vue'

// Добавляем переменные для формы
const fullName = ref('')
const phoneNumber = ref('')
const willAttend = ref(false)
const willNotAttend = ref(false)
const isSubmitting = ref(false)
const submitResult = ref({ success: false, message: '' })

const program = [
  {
    time: '16:00',
    title: 'Велком',
    description: 'Просим взять с собой хорошее настроение и улыбки',
  },
  {
    time: '17:00',
    title: 'Церемония',
    description: 'Вы станете свидетелем трогательного момента. Не забудьте приготовить платочки',
  },
  {
    time: '18:00',
    title: 'Банкет',
    description: 'Время вкусной еды, танцев и развлечений',
  },
]
const dressCode = [
  {
    title: 'Леди',
    description: 'Элегантные платья, костюмы. Однотонные ткани без принтов',
  },
  {
    title: 'Мужчины',
    description: 'Брюки, рубашки, жилет или пиджак',
  },
]

const dressCodeTextLiterals = ['D', 'r', 'e', 's', 's', ' ', 'c', 'o', 'd', 'e']

const contactMethods = [
  {
    name: ['Максим', 'Максиму'],
    telegram: 'maksim908908',
  },
  {
    name: ['Виталина', 'Виталине'],
    telegram: 'so_vi_so',
  },
]

// Обратный отсчет до свадьбы
const weddingDate = new Date('2025-06-04T16:00:00')
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

const updateCountdown = () => {
  const now = new Date()
  const diff = weddingDate.getTime() - now.getTime()

  if (diff <= 0) {
    days.value = 0
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
    return
  }

  days.value = Math.floor(diff / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  minutes.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((diff % (1000 * 60)) / 1000)
}

let countdownInterval: number | null = null

function openMap() {
  window.open('https://yandex.ru/maps/-/CHu3UYJz', '_blank')
}

function openContactMethod(tgId: string) {
  window.open(`https://t.me/${tgId}`)
}

// Функции для обработки изменения чекбоксов
function handleAttendChange(value: boolean) {
  if (value) {
    willNotAttend.value = false
  }
}

function handleNotAttendChange(value: boolean) {
  if (value) {
    willAttend.value = false
  }
}

// Функция для проверки правильности формата телефона
function isValidPhoneNumber(phone: string): boolean {
  // Проверяем, что телефон соответствует формату +7XXXXXXXXXX
  // и содержит 12 символов (включая +7 и 10 цифр номера)
  return /^\+7\d{10}$/.test(phone)
}

function formatPhone() {
  let value = event.target.value

  // Разрешаем только цифры после +7
  value = value.replace(/[^+\d]/g, '')

  // Запрещаем удалять +7
  if (!value.startsWith('+7')) {
    value = '+7'
  }

  // Ограничиваем длину
  if (value.length > 12) {
    value = value.slice(0, 12)
  }

  phoneNumber.value = value
}

// Функция для отправки данных на сервер
async function submitForm() {
  if (!fullName.value) {
    submitResult.value = { success: false, message: 'Пожалуйста, укажите ваше имя' }
    return
  }

  if (!phoneNumber.value || !isValidPhoneNumber(phoneNumber.value)) {
    submitResult.value = {
      success: false,
      message: 'Пожалуйста, укажите корректный номер телефона',
    }
    return
  }

  if (!willAttend.value && !willNotAttend.value) {
    submitResult.value = { success: false, message: 'Пожалуйста, укажите, придете ли вы' }
    return
  }

  isSubmitting.value = true
  submitResult.value = { success: false, message: '' }

  try {
    // Используем URL сервера из переменной окружения
    const SERVER_URL = import.meta.env.VITE_API_URL + '/api/submit-rsvp'

    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: fullName.value,
        phoneNumber: phoneNumber.value,
        willAttend: willAttend.value,
      }),
      credentials: 'include',
      // Убираем режим no-cors, чтобы получать реальные статусы ответов
    })

    // Проверяем статус ответа
    if (!response.ok) {
      // Если статус 401, значит проблема с авторизацией
      if (response.status === 401) {
        submitResult.value = {
          success: false,
          message: 'Ошибка авторизации. Пожалуйста, свяжитесь с организаторами.',
        }
      } else {
        submitResult.value = {
          success: false,
          message: `Ошибка сервера: ${response.status}. Пожалуйста, свяжитесь с нами напрямую.`,
        }
      }
      return
    }

    // Пытаемся прочитать ответ как JSON
    let result
    try {
      result = await response.json()
    } catch {
      // Если не удалось прочитать JSON, считаем что запрос успешен
      result = { success: true }
    }

    if (result.success) {
      submitResult.value = {
        success: true,
        message: result.message || 'Спасибо! Ваш ответ отправлен.',
      }
      // Очистка формы после успешной отправки
      fullName.value = ''
      phoneNumber.value = ''
      willAttend.value = false
      willNotAttend.value = false
    } else {
      submitResult.value = {
        success: false,
        message: result.message || 'Произошла ошибка при отправке.',
      }
    }
  } catch (error) {
    // Проверяем, является ли ошибка связанной с CORS
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      submitResult.value = {
        success: false,
        message: 'Ошибка CORS. Пожалуйста, свяжитесь с нами напрямую через Telegram.',
      }
    } else {
      submitResult.value = {
        success: false,
        message: 'Произошла ошибка при отправке. Пожалуйста, свяжитесь с нами напрямую.',
      }
    }
    console.error('Error sending form:', error)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  updateCountdown()
  countdownInterval = window.setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (countdownInterval !== null) {
    clearInterval(countdownInterval)
  }
})
</script>

<template>
  <main class="main-container">
    <img src="@/assets/img/main-photo.jpg" alt="Максим & Виталина" />
    <section>
      <h1 v-scroll-animation class="pt-2">Максим & Виталина</h1>
      <PageArrow v-scroll-animation="{ delay: 100 }" />
      <div class="flex flex-col items-center gap-2 pb-5" v-scroll-animation="{ delay: 200 }">
        <p>В нашей жизни скоро состоится важное событие - наша свадьба!</p>
        <div class="flex items-center justify-end gap-2 text-lg">
          <div class="flex items-center">
            <span class="font-bold">{{ days }}</span>
            <span class="text-sm leading-none">д</span>
          </div>
          <span>-</span>
          <div class="flex items-center">
            <span class="font-bold">{{ hours }}</span>
            <span class="text-sm leading-none">ч</span>
          </div>
          <span>-</span>
          <div class="flex items-center">
            <span class="font-bold">{{ minutes }}</span>
            <span class="text-sm leading-none">м</span>
          </div>
          <span>-</span>
          <div class="flex items-center">
            <span class="font-bold">{{ seconds }}</span>
            <span class="text-sm leading-none">с</span>
          </div>
        </div>
      </div>
    </section>
    <section class="flex flex-col items-center">
      <div class="flex">
        <div
          class="w-1/2 aspect-[3/4] overflow-hidden"
          v-scroll-animation="{ animation: 'fade-in-left' }"
        >
          <img
            src="@/assets/img/photo-1.jpg"
            alt="Максим & Виталина"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          class="flex flex-col items-center justify-between gap-2 px-2 py-10 w-1/2"
          v-scroll-animation="{ animation: 'fade-in-right', delay: 200 }"
        >
          <div class="flex flex-col items-center gap-4">
            <h3 class="latin-text">Save the date</h3>
            <p class="text-lg italic">04.06.2025</p>
          </div>
          <IconArrowDown />
          <p>В этот чудесный день когда мы станем семьей</p>
        </div>
      </div>
      <p class="p-5" v-scroll-animation>Мы приглашаем вас разделить с нами этот особенный день!</p>
    </section>
    <section>
      <div>
        <div class="p-2 pb-0">
          <div class="border-2 border-b-0 flex flex-col items-center pb-8 gap-16 border-black">
            <h2 v-scroll-animation>Локация</h2>
            <p v-scroll-animation>
              г. Москва, пос. Новобутаково, дом 44 стр. 1, «Английский дом и Веранда»
            </p>
          </div>
        </div>
        <div class="flex items-start w-full">
          <div
            class="w-1/2 h-80 flex flex-col justify-center"
            v-scroll-animation="{ animation: 'fade-in-left' }"
          >
            <div class="overflow-hidden relative">
              <div class="absolute -top-8 left-0 bg-white h-8 w-full z-10" />
              <img src="@/assets/img/location.jpg" alt="Локация" class="h-80 object-cover" />
            </div>
          </div>
          <div class="w-1/2 flex flex-col h-80 justify-between items-center">
            <div class="w-full h-full pr-2 pb-4">
              <div
                class="flex flex-col h-full items-center justify-between px-5 border-r-2 border-black"
              >
                <PageArrow />
                <button @click="openMap" class="w-full">Карта <IconArrowRight /></button>
              </div>
            </div>
            <div class="relative shrink-0">
              <div class="absolute -top-8 left-0 bg-white h-8 w-full z-10" />
              <p
                class="bg-neutral-950 text-white !text-2xl p-8 w-full text-center mt-4"
                v-scroll-animation="{ animation: 'zoom-in' }"
              >
                Сбор гостей в 16:00
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <h2 v-scroll-animation>Программа дня</h2>
      <PageArrow v-scroll-animation="{ delay: 100 }" />
      <div class="flex flex-col gap-8 pb-5">
        <div
          v-for="(item, index) in program"
          :key="item.title"
          class="flex flex-col items-center gap-2"
          v-scroll-animation="{ delay: index * 200 }"
        >
          <h4>{{ item.time }} - {{ item.title }}</h4>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </section>
    <section>
      <div class="flex flex-col gap-8 items-center">
        <div class="flex" style="height: 475px">
          <div
            class="vertical-text flex justify-between text-7xl px-0 py-3 uppercase tracking-wide latin-text"
            style="height: 475px"
            v-scroll-animation="{ animation: 'fade-in-left' }"
          >
            <span v-for="letter in dressCodeTextLiterals" :key="letter" class="my-1">
              {{ letter === ' ' ? '\u00A0' : letter }}
            </span>
          </div>
          <div
            class="w-full relative overflow-hidden"
            style="height: 475px"
            v-scroll-animation="{ animation: 'fade-in-right', delay: 200 }"
          >
            <img
              src="@/assets/img/dresscode.jpg"
              alt="Dress code"
              class="dress-code-image w-full h-full object-cover"
              style="display: block; min-height: 100%"
            />
          </div>
        </div>
        <p v-scroll-animation>
          Мы очень ждём и с трепетом готовимся к нашему празднику! Будем очень благодарны, если вы
          поддержите цветовую гамму нашей свадьбы.
        </p>
        <div
          class="flex gap-1 justify-center w-full px-2"
          v-scroll-animation="{ animation: 'zoom-in' }"
        >
          <img src="@/assets/img/material.jpg" alt="Dress code" class="w-1/6 h-10" />
          <div class="bg-[#D9D9D9] w-1/6 h-10 shrink-0 grow" />
          <div class="bg-[#8F9095] w-1/6 h-10 shrink-0 grow" />
          <div class="bg-[#473B32] w-1/6 h-10 shrink-0 grow" />
          <div class="bg-[#000000] w-1/6 h-10 shrink-0 grow" />
        </div>
        <div class="flex flex-col gap-8">
          <div
            v-for="(item, index) in dressCode"
            :key="item.title"
            class="flex flex-col items-center gap-2"
            v-scroll-animation="{ delay: index * 200 }"
          >
            <h4>{{ item.title }}</h4>
            <p>{{ item.description }}</p>
          </div>
        </div>
        <PageArrow class="!pt-0" v-scroll-animation />
      </div>
    </section>
    <section>
      <div class="flex flex-col items-center gap-4" v-scroll-animation>
        <h2>Детали</h2>
        <p>
          Ваши улыбки и смех подарят нам незабываемое счастье в этот день, а пожелания в конвертах
          помогут осуществить наши мечты!
        </p>
        <p>
          Пожалуйста, не дарите нам живые цветы. Мы не успеем насладится их красотой до отъезда в
          свадебное путешествие.
        </p>
      </div>
      <PageArrow v-scroll-animation="{ delay: 100 }" />
    </section>
  </main>
  <footer class="footer-container flex flex-col items-center">
    <div class="border-b border-gray-100 py-4 flex justify-center w-full" v-scroll-animation>
      <p class="text-black/70 w-full text-center px-4">
        Будем очень признательны, если Вы сообщите нам о своем решении до
        <span class="text-black">04.04.2025</span>
      </p>
    </div>
    <div
      class="inline-flex flex-col items-center gap-5 py-4 w-full max-w-md mx-auto"
      v-scroll-animation
    >
      <h4 class="text-center w-full mb-4 text-xl">Анкета</h4>
      <form class="flex flex-col gap-5 w-full pb-5" @submit.prevent="submitForm">
        <div class="flex items-center justify-between gap-2 border-b border-gray-300">
          <input
            v-model="fullName"
            type="text"
            placeholder="Полное имя"
            class="w-full p-2 mb-2 outline-none"
            required
          />
          <IconPeople />
        </div>
        <div class="flex items-center justify-between gap-2 border-b border-gray-300">
          <input
            v-model="phoneNumber"
            type="tel"
            placeholder="Телефон"
            class="w-full p-2 mb-2 outline-none"
            required
            @input="formatPhone"
          />
          <IconCall />
        </div>
        <div class="flex flex-col gap-5 w-full">
          <div class="flex items-center gap-2">
            <input
              id="attend-checkbox"
              v-model="willAttend"
              type="checkbox"
              @change="handleAttendChange(willAttend)"
            />
            <label for="attend-checkbox">С удовольствием пойду</label>
          </div>
          <div class="flex items-center gap-2">
            <input
              id="not-attend-checkbox"
              v-model="willNotAttend"
              type="checkbox"
              @change="handleNotAttendChange(willNotAttend)"
            />
            <label for="not-attend-checkbox">К сожалению, не смогу прийти</label>
          </div>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="relative bg-black text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-all disabled:opacity-70"
        >
          <span v-if="isSubmitting">Отправка...</span>
          <span v-else>Отправить</span>
        </button>

        <!-- Сообщение о результате отправки -->
        <div
          v-if="submitResult.message"
          class="mt-2 text-center p-2 rounded-md"
          :class="{
            'bg-green-100 text-green-800': submitResult.success,
            'bg-red-100 text-red-800': !submitResult.success,
          }"
        >
          {{ submitResult.message }}
        </div>
      </form>
      <div class="flex items-center gap-2 w-full my-4">
        <div class="h-px flex-1 bg-gray-300" />
        <span class="px-2">или</span>
        <div class="h-px flex-1 bg-gray-300" />
      </div>
      <p>Узнайте, как связаться с нами другим способом</p>
      <div class="flex flex-col gap-2 w-full">
        <div
          v-for="(item, index) in contactMethods"
          :key="item.name[0]"
          class="flex flex-col gap-1 cursor-pointer"
          v-scroll-animation="{ delay: index * 200 }"
          @click="openContactMethod(item.telegram)"
        >
          <div
            class="flex items-center justify-between gap-2 w-full p-2 border border-gray-300 rounded-md"
          >
            <span class="text-black/70">
              <span class="text-black">{{ item.name[0] }}</span> в телеграм</span
            >
            <IconTelegram />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center gap-4" v-scroll-animation>
      <h4 class="!text-3xl text-center pt-10">До встречи!</h4>
      <img src="@/assets/img/farewell.jpg" alt="Farewell" class="w-full h-full object-cover" />
    </div>
  </footer>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  position: relative;
  /* Предотвращаем горизонтальный скролл */
  overflow-x: hidden;
  /* Разрешаем только один вертикальный скролл */
  overflow-y: auto;
  height: 100%;
}

/* Специальные классы для основных контейнеров */
.main-container,
.footer-container {
  width: 100%;
  overflow: visible !important; /* Принудительно убираем скроллы */
  position: relative;
  box-sizing: border-box;
  /* Убираем возможные отступы, которые могут создавать скроллы */
  margin: 0;
  padding: 0;
}

/* Предотвращаем скролл внутри основных контейнеров */
main,
footer {
  width: 100%;
  /* Полностью убираем скроллы для контейнеров */
  overflow: visible !important; /* Принудительно убираем скроллы */
  /* Убираем возможные свойства, которые могут создавать скроллы */
  position: relative;
  box-sizing: border-box;
}

/* Оптимизация для анимаций */
[v-scroll-animation] {
  /* Улучшаем производительность анимаций */
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  /* Предотвращаем возможные проблемы с позиционированием */
  transform-style: preserve-3d;
  position: relative;
  z-index: 1;
}

/* Дополнительные стили для предотвращения скроллов */
section {
  overflow: visible !important; /* Принудительно убираем скроллы */
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

/* Убираем возможные скроллы у контейнеров с overflow-hidden */
.overflow-hidden {
  overflow: hidden !important;
}

/* Исправляем проблемы с контейнерами, которые могут создавать скроллы */
.flex,
.flex-col,
.items-center,
.justify-center {
  overflow: visible !important;
}

/* Исправляем проблемы с изображениями */
img {
  max-width: 100%;
  height: auto;
}

/* Стили для контейнеров с фиксированной высотой */
.h-80 {
  height: 20rem;
  min-height: 20rem;
  max-height: 20rem;
  box-sizing: border-box;
}

/* Стили для контейнеров с изображениями */
.flex-grow.overflow-hidden[style*='height'] {
  flex-grow: 0 !important; /* Предотвращаем изменение высоты */
  flex-shrink: 0 !important;
}

/* Стили для контейнеров с фиксированной высотой в пикселях */
.h-\[328px\] {
  height: 328px !important;
  min-height: 328px !important;
  max-height: 328px !important;
  box-sizing: border-box;
}

/* Стили для изображений с сохранением пропорций */
.object-cover.absolute.inset-0 {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

/* Специальный стиль для изображения дресс-кода */
.dress-code-image {
  object-fit: cover !important;
  width: 100% !important;
  height: 100% !important;
  display: block !important;
  min-height: 100% !important;
  position: relative !important;
}

/* Стили для относительного позиционирования */
.relative {
  position: relative;
  overflow: hidden;
}
</style>
