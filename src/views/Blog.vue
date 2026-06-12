<template>
  <div class="min-h-screen bg-gray-50">
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Header -->
        <div class="text-center mb-12" data-aos="fade-up">
          <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Блог AlbaDent
          </h1>
          <div class="w-20 h-1 bg-blue-600 rounded-full mx-auto mb-6"></div>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Обучающие материалы, инструкции и новости из мира стоматологии
          </p>
        </div>

        <!-- Categories Filter -->
        <div
          class="flex flex-wrap justify-center gap-3 mb-12"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <button
            @click="selectedCategory = 'all'"
            :class="[
              'px-6 py-2 rounded-lg font-semibold transition-all duration-300',
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100',
            ]"
          >
            Все
          </button>
          <button
            @click="selectedCategory = 'video'"
            :class="[
              'px-6 py-2 rounded-lg font-semibold transition-all duration-300',
              selectedCategory === 'video'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100',
            ]"
          >
            <font-awesome-icon :icon="['fas', 'video']" class="mr-2" />
            Видео
          </button>
          <button
            @click="selectedCategory = 'education'"
            :class="[
              'px-6 py-2 rounded-lg font-semibold transition-all duration-300',
              selectedCategory === 'education'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100',
            ]"
          >
            <font-awesome-icon :icon="['fas', 'graduation-cap']" class="mr-2" />
            Обучение
          </button>
          <button
            @click="selectedCategory = 'instruction'"
            :class="[
              'px-6 py-2 rounded-lg font-semibold transition-all duration-300',
              selectedCategory === 'instruction'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100',
            ]"
          >
            <font-awesome-icon :icon="['fas', 'book']" class="mr-2" />
            Инструкции
          </button>
          <button
            @click="selectedCategory = 'news'"
            :class="[
              'px-6 py-2 rounded-lg font-semibold transition-all duration-300',
              selectedCategory === 'news'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100',
            ]"
          >
            <font-awesome-icon :icon="['fas', 'newspaper']" class="mr-2" />
            Новости
          </button>
        </div>

        <!-- Blog Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="(post, index) in filteredPosts"
            :key="post.id"
            class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            <!-- Image/Video Thumbnail -->
            <div class="relative h-64 bg-gray-200 overflow-hidden group">
              <!-- Если это видео, показываем <video> -->
              <video
                v-if="post.type === 'video'"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                controls
              >
                <source :src="post.video" type="video/mp4" />
                Ваш браузер не поддерживает воспроизведение видео.
              </video>

              <!-- Если это не видео, показываем картинку -->
              <img
                v-else
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <!-- Category Badge -->
              <div class="absolute top-4 left-4">
                <span
                  :class="getCategoryClass(post.category)"
                  class="px-3 py-1 rounded-lg text-xs font-semibold"
                >
                  {{ getCategoryLabel(post.category) }}
                </span>
              </div>

              <!-- Duration для видео -->
              <div
                v-if="post.type === 'video' && post.duration"
                class="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-semibold"
              >
                {{ post.duration }}
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 flex flex-col flex-1">
              <div class="flex items-center text-sm text-gray-500 mb-3">
                <span class="text-blue-600 font-medium">{{ post.author }}</span>
                <span class="mx-2">•</span>
                <span>{{ post.date }}</span>
              </div>

              <h3
                class="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2"
              >
                {{ post.title }}
              </h3>

              <p class="text-gray-600 mb-4 leading-relaxed flex-1 line-clamp-3">
                {{ post.excerpt }}
              </p>

              <router-link
                :to="{ name: 'blog-detail', params: { id: post.id } }"
                class="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors group mt-auto"
              >
                Читать далее
                <font-awesome-icon
                  :icon="['fas', 'arrow-right']"
                  class="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </router-link>
            </div>
          </article>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center mt-12" data-aos="fade-up">
          <nav class="flex items-center space-x-2">
            <button
              class="w-10 h-10 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              1
            </button>
            <button
              class="w-10 h-10 bg-white text-gray-600 rounded-lg font-semibold hover:bg-gray-100 border border-gray-200 transition-colors"
            >
              2
            </button>
            <button
              class="w-10 h-10 bg-white text-gray-600 rounded-lg font-semibold hover:bg-gray-100 border border-gray-200 transition-colors"
            >
              3
            </button>
          </nav>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">
          Подпишитесь на нашу рассылку
        </h2>
        <p class="text-blue-100 mb-8">
          Получайте последние новости, обучающие материалы и специальные
          предложения
        </p>

        <div
          class="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="Ваш email"
            class="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <font-awesome-icon :icon="['fas', 'paper-plane']" class="mr-2" />
            Подписаться
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const selectedCategory = ref("all");

const blogPosts = ref([
  // Видео материалы
  {
    id: 1,
    title: "Инструкция по применению Durosil",
    excerpt:
      "Пошаговое видео-руководство по использованию Durosil в стоматологической практике.",
    video: "/albadent/video/durosil-instruktion.MOV",
    author: "AlbaDent",
    date: "01 Ноя 2025",
    category: "video",
    type: "video",
    duration: "08:12",
  },
  {
    id: 2,
    title: "Dynamic Plus — видеоруководство 1",
    excerpt:
      "Показана техника работы с композитом Dynamic Plus для реставраций передних и жевательных зубов.",
    video: "/albadent/video/dynamic-plus-2.MP4",
    author: "AlbaDent",
    date: "05 Ноя 2025",
    category: "video",
    type: "video",
    duration: "10:05",
  },
  {
    id: 3,
    title: "Dynamic Plus — видеоруководство 2",
    excerpt:
      "Дополнительное видео по использованию Dynamic Plus, фокус на тонкий слой и адаптацию композита.",
    video: "/albadent/video/dynamic-plus.MP4",
    author: "AlbaDent",
    date: "06 Ноя 2025",
    category: "video",
    type: "video",
    duration: "09:30",
  },
  {
    id: 4,
    title: "ExTracem — фиксация коронок",
    excerpt:
      "Видео-инструкция по применению стеклоиономерного цемента ExTracem для фиксации коронок и мостов.",
    video: "/albadent/video/extracem.MP4",
    author: "AlbaDent",
    date: "07 Ноя 2025",
    category: "video",
    type: "video",
    duration: "07:45",
  },
  {
    id: 5,
    title: "Курсы и конгрессы AlbaDent",
    excerpt:
      "Обзор прошедших образовательных мероприятий: курсы и конгрессы для стоматологов.",
    video: "/albadent/video/kurs-va-kongresslar.MP4",
    author: "AlbaDent",
    date: "10 Ноя 2025",
    category: "education",
    type: "video",
    duration: "12:50",
  },
  {
    id: 6,
    title: "STARK — Bulk Fill Composite",
    excerpt:
      "Видео по работе с микрогибридным композитом STARK для крупных реставраций.",
    video: "/albadent/video/stark.MOV",
    author: "AlbaDent",
    date: "11 Ноя 2025",
    category: "video",
    type: "video",
    duration: "08:40",
  },
  {
    id: 7,
    title: "Новости AlbaDent",
    excerpt: "Обзор последних новостей и событий в стоматологии от AlbaDent.",
    video: "/albadent/video/yangilik 1.MP4",
    author: "AlbaDent",
    date: "13 Ноя 2025",
    category: "news",
    type: "video",
    duration: "05:20",
  },
  {
    id: 8,
    title: "Zenchroma — универсальный композит",
    excerpt:
      "Видео-инструкция по применению универсального композита Zenchroma для реставраций передних и жевательных зубов.",
    video: "/albadent/video/zechroma.MP4",
    author: "AlbaDent",
    date: "14 Ноя 2025",
    category: "video",
    type: "video",
    duration: "09:55",
  },
  {
    id: 9,
    title: "ZENIT LC — керамический композит",
    excerpt:
      "Пошаговое видео по работе с керамическим композитом Zenit LC для передних зубов.",
    video: "/albadent/video/zenit-ceramik-composit.MOV",
    author: "AlbaDent",
    date: "15 Ноя 2025",
    category: "video",
    type: "video",
    duration: "08:30",
  },
  {
    id: 10,
    title: "ZenitCem — готовый цемент",
    excerpt:
      "Инструкция по использованию готового цемента ZenitCem для фиксации реставраций.",
    video: "/albadent/video/zenitcem.MP4",
    author: "AlbaDent",
    date: "16 Ноя 2025",
    category: "education",
    type: "video",
    duration: "06:50",
  },

  // Обучающие материалы
  {
    id: 11,
    title: "Основы стоматологической имплантации",
    excerpt:
      "Комплексный обучающий курс по планированию и проведению имплантации зубов с использованием современных материалов.",
    image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800",
    author: "Администратор",
    date: "08 Янв 2025",
    category: "education",
    type: "article",
  },
  {
    id: 12,
    title: "Современные композитные материалы: выбор и применение",
    excerpt:
      "Подробный гайд по выбору композитных материалов для различных клинических ситуаций.",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800",
    author: "Администратор",
    date: "05 Янв 2025",
    category: "education",
    type: "article",
  },
  {
    id: 13,
    title: "Протоколы стерилизации в стоматологии",
    excerpt:
      "Актуальные протоколы и стандарты стерилизации инструментов и оборудования в стоматологической практике.",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800",
    author: "Администратор",
    date: "03 Янв 2025",
    category: "education",
    type: "article",
  },

  // Инструкции
  {
    id: 14,
    title: "Инструкция по эксплуатации рентген-аппарата",
    excerpt:
      "Пошаговое руководство по безопасной эксплуатации и обслуживанию стоматологического рентген-оборудования.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800",
    author: "Администратор",
    date: "01 Янв 2025",
    category: "instruction",
    type: "article",
  },
  {
    id: 15,
    title: "Настройка и калибровка автоклава: руководство",
    excerpt:
      "Детальная инструкция по правильной настройке, калибровке и техническому обслуживанию автоклава.",
    image: "https://images.unsplash.com/photo-1581594549595-35f6edc7b762?w=800",
    author: "Администратор",
    date: "28 Дек 2024",
    category: "instruction",
    type: "article",
  },
  {
    id: 16,
    title: "Правила работы с композитными светильниками",
    excerpt:
      "Инструкция по безопасному использованию фотополимеризационных ламп и уходу за ними.",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800",
    author: "Администратор",
    date: "25 Дек 2024",
    category: "instruction",
    type: "article",
  },

  // Новости
  {
    id: 17,
    title: "AlbaDent представляет новую линейку продуктов",
    excerpt:
      "Мы рады объявить о расширении нашего ассортимента премиальными стоматологическими материалами европейского качества.",
    image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=800",
    author: "Администратор",
    date: "20 Дек 2024",
    category: "news",
    type: "article",
  },
  {
    id: 18,
    title: "Итоги международной конференции по стоматологии",
    excerpt:
      "Наша команда приняла участие в крупнейшей международной выставке стоматологического оборудования.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    author: "Администратор",
    date: "18 Дек 2024",
    category: "news",
    type: "article",
  },
  {
    id: 19,
    title: "Специальное предложение на зимний сезон",
    excerpt:
      "Воспользуйтесь выгодными условиями на популярные позиции стоматологических материалов и инструментов.",
    image: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=800",
    author: "Администратор",
    date: "15 Дек 2024",
    category: "news",
    type: "article",
  },
]);

const filteredPosts = computed(() => {
  if (selectedCategory.value === "all") {
    return blogPosts.value;
  }
  return blogPosts.value.filter(
    (post) => post.category === selectedCategory.value
  );
});

const getCategoryClass = (category) => {
  const classes = {
    video: "bg-red-500 text-white",
    education: "bg-green-500 text-white",
    instruction: "bg-purple-500 text-white",
    news: "bg-blue-500 text-white",
  };
  return classes[category] || "bg-gray-500 text-white";
};

const getCategoryLabel = (category) => {
  const labels = {
    video: "Видео",
    education: "Обучение",
    instruction: "Инструкция",
    news: "Новость",
  };
  return labels[category] || "Статья";
};

onMounted(() => {
  if (window.AOS) {
    setTimeout(() => window.AOS.refresh(), 100);
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  --webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  --webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
