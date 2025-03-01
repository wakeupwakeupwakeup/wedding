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
  <main>
    <img src="@/assets/img/main-photo.jpg" alt="Максим & Виталина" />
    <section>
      <h1>Максим & Виталина</h1>
      <PageArrow />
      <div class="flex flex-col items-center gap-2 pb-5">
        <p>В нашей жизни скоро состоится важное событие - наша свадьба!</p>
        <div class="flex items-center justify-center gap-2 text-lg">
          <div class="flex items-center">
            <span class="font-bold">{{ days }}</span>
            <span class="text-sm">д</span>
          </div>
          <span>-</span>
          <div class="flex items-center">
            <span class="font-bold">{{ hours }}</span>
            <span class="text-sm">ч</span>
          </div>
          <span>-</span>
          <div class="flex items-center">
            <span class="font-bold">{{ minutes }}</span>
            <span class="text-sm">м</span>
          </div>
          <span>-</span>
          <div class="flex items-center">
            <span class="font-bold">{{ seconds }}</span>
            <span class="text-sm">с</span>
          </div>
        </div>
      </div>
    </section>
    <section class="flex flex-col items-center">
      <div class="flex">
        <div class="w-1/2 aspect-[3/4] overflow-hidden">
          <img
            src="@/assets/img/photo-1.jpg"
            alt="Максим & Виталина"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="flex flex-col items-center justify-between gap-2 px-2 py-10 w-1/2">
          <div class="flex flex-col items-center gap-4">
            <h3>Save the date</h3>
            <p class="text-lg italic">04.06.2025</p>
          </div>
          <IconArrowDown />
          <p>В этот чудесный день когда мы станем семьей</p>
        </div>
      </div>
      <p class="p-5">Мы приглашаем вас разделить с нами этот особенный день!</p>
    </section>
    <section>
      <div>
        <div class="p-2 pb-0">
          <div class="border-2 border-b-0 flex flex-col items-center gap-16 border-black">
            <h2>Локация</h2>
            <p>г. Москва, пос. Новобутаково, дом 44 стр. 1, «Английский дом и Веранда»</p>
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
                <button class="w-full">Карта <IconArrowRight /></button>
              </div>
            </div>

            <p class="border-break bg-neutral-950 text-white text-2xl p-8 w-full text-center">
              Сбор гостей в 16:00
            </p>
          </div>
        </div>
      </div>
    </section>
    <section>
      <h2>Программа дня</h2>
      <PageArrow />
      <div class="flex flex-col gap-8 pb-5">
        <div v-for="item in program" :key="item.title" class="flex flex-col items-center gap-2">
          <h4>{{ item.time }} - {{ item.title }}</h4>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </section>
    <section>
      <div class="flex flex-col gap-8 items-center">
        <div class="flex">
          <h2 class="vertical-text text-7xl px-0 py-3">Dress code</h2>
          <div class="w-full">
            <img src="@/assets/img/dresscode.jpg" alt="Dress code" class="object-fit" />
          </div>
        </div>
        <p>
          Мы очень ждём и с трепетом готовимся к нашему празднику! Будем очень благодарны, если вы
          поддержите цветовую гамму нашей свадьбы.
        </p>
        <div class="flex gap-1 justify-center w-full px-2">
          <img src="@/assets/img/material.jpg" alt="Dress code" class="w-1/6 h-10" />
          <div class="bg-[#D9D9D9] w-1/6 h-10 shrink-0 grow" />
          <div class="bg-[#8F9095] w-1/6 h-10 shrink-0 grow" />
          <div class="bg-[#473B32] w-1/6 h-10 shrink-0 grow" />
          <div class="bg-[#000000] w-1/6 h-10 shrink-0 grow" />
        </div>
        <div class="flex flex-col gap-8">
          <div v-for="item in dressCode" :key="item.title" class="flex flex-col items-center gap-2">
            <h4>{{ item.title }}</h4>
            <p>{{ item.description }}</p>
          </div>
        </div>
        <PageArrow class="!pt-0" />
      </div>
    </section>
    <section>
      <div class="flex flex-col items-center gap-4">
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
      <PageArrow />
    </section>
  </main>
  <footer class="w-full">
    <div class="w-full">
      <div class="border-b border-gray-100 py-4 flex justify-center w-full">
        <p class="text-black/70 w-full text-center px-4">
          Будем очень признательны, если Вы сообщите нам о своем решении до
          <span class="text-black">04.04.2025</span>
        </p>
      </div>
      <div class="w-full flex flex-col items-center py-4">
        <h4 class="text-center w-full mb-4">Анкета</h4>
        <input
          type="text"
          placeholder="Ваше имя"
          class="w-full max-w-80 p-2 border border-gray-300 mb-2"
        />
      </div>
    </div>
  </footer>
</template>
