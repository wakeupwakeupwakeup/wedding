<script setup lang="ts">
import PageArrow from '@/components/atoms/PageArrow.vue'
import IconArrowDown from '@/components/icons/IconArrowDown.vue'
import IconArrowRight from '@/components/icons/IconArrowRight.vue'
import { ref, onMounted, onUnmounted } from 'vue'

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
    telegram: '@max_kuznetsov',
    phone: '+79161234567',
  },
  {
    name: ['Виталина', 'Виталине'],
    telegram: '@vitalina_kuznetsova',
    phone: '+79161234567',
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
      <h1 v-scroll-animation>Максим & Виталина</h1>
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
          <div class="border-2 border-b-0 flex flex-col items-center gap-16 border-black">
            <h2 v-scroll-animation>Локация</h2>
            <p v-scroll-animation>
              г. Москва, пос. Новобутаково, дом 44 стр. 1, «Английский дом и Веранда»
            </p>
          </div>
        </div>
        <div class="flex items-start w-full">
          <div class="w-1/2 h-80 flex flex-col justify-center overflow-hidden">
            <div class="bg-white h-8 w-full" />
            <div class="flex-grow overflow-hidden">
              <img
                src="@/assets/img/location.jpg"
                alt="Локация"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
          <div class="w-1/2 flex flex-col h-80 items-center">
            <div class="w-full h-full grow pr-2">
              <div
                class="flex flex-col h-full items-center justify-center px-5 border-r-2 border-black"
              >
                <PageArrow />
                <button @click="openMap" class="w-full">Карта <IconArrowRight /></button>
              </div>
            </div>

            <p class="border-break bg-neutral-950 text-white !text-2xl p-8 w-full text-center">
              Сбор гостей в 16:00
            </p>
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
        <div class="flex">
          <div
            class="vertical-text flex justify-between text-7xl px-0 py-3 uppercase tracking-wide latin-text"
            v-scroll-animation="{ animation: 'fade-in-left' }"
          >
            <span v-for="letter in dressCodeTextLiterals" :key="letter" class="my-1">
              {{ letter === ' ' ? '\u00A0' : letter }}
            </span>
          </div>
          <div class="w-full" v-scroll-animation="{ animation: 'fade-in-right', delay: 200 }">
            <img src="@/assets/img/dresscode.jpg" alt="Dress code" class="object-fit" />
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
    <div class="inline-flex flex-col items-center py-4 w-full max-w-72 mx-auto" v-scroll-animation>
      <h4 class="text-center w-full mb-4">Анкета</h4>
      <form>
        <input
          type="text"
          placeholder="Полное имя"
          class="w-full max-w-80 p-2 border border-gray-300 mb-2"
        />
        <input
          type="tel"
          placeholder="Телефон"
          class="w-full max-w-80 p-2 border border-gray-300 mb-2"
        />
        <div class="flex flex-col w-full">
          <div class="flex items-center gap-2">
            <input type="checkbox" />
            <label>С удовольствием пойду</label>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" />
            <label>К сожалению, не смогу прийти</label>
          </div>
        </div>
        <button>Отправить</button>
      </form>
      <div class="flex items-center gap-2 w-full my-4">
        <div class="h-px flex-1 bg-gray-300" />
        <span class="px-2">или</span>
        <div class="h-px flex-1 bg-gray-300" />
      </div>
      <p>Узнайте, как связаться с нами другим способом</p>
      <div class="flex flex-col gap-2">
        <div
          v-for="(item, index) in contactMethods"
          :key="item.name[0]"
          class="flex flex-col gap-2"
          v-scroll-animation="{ delay: index * 200 }"
        >
          <div class="flex items-center justify-between gap-2">
            <span>{{ item.name[0] }}</span> в телеграм
          </div>
          <div class="flex items-center justify-between gap-2">
            <span>Позвонить {{ item.name[1] }}</span>
          </div>
        </div>
      </div>
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
</style>
