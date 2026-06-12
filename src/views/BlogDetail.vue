<template>
    <div class="min-h-screen bg-gray-50 py-20">
        <div class="max-w-7xl mx-auto px-4">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <!-- Main Content -->
                <div class="lg:col-span-2">
                    <article class="bg-white rounded-xl shadow-md overflow-hidden">
                        <!-- Featured Video/Image -->
                        <div class="relative">
                            <!-- Видео -->
                            <div v-if="post.type === 'video'" class="aspect-video bg-gray-900">
                                <video 
                                    ref="videoPlayer"
                                    class="w-full h-full"
                                    :style="{ aspectRatio: videoAspectRatio }"
                                    controls
                                    @loadedmetadata="onVideoLoaded"
                                >
                                    <source :src="post.video" type="video/mp4" />
                                </video>

                                <!-- Aspect Ratio Toggle Button -->
                                <button 
                                    @click="toggleAspectRatio" 
                                    class="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-lg transition-colors z-10"
                                    :title="videoAspectRatio === '9/16' ? 'Переключить на 16:9' : 'Переключить на 9:16'"
                                >
                                    <font-awesome-icon 
                                        :icon="['fas', videoAspectRatio === '9/16' ? 'expand' : 'compress']" 
                                        class="text-lg" 
                                    />
                                </button>
                            </div>

                            <!-- Изображение -->
                            <img v-else :src="post.image" :alt="post.title" class="w-full h-96 object-cover">
                        </div>

                        <!-- Content -->
                        <div class="p-8">
                            <!-- Meta Info -->
                            <div class="flex items-center text-sm text-gray-500 mb-6">
                                <span :class="getCategoryClass(post.category)" class="px-3 py-1 rounded-lg text-xs font-semibold mr-4">
                                    {{ getCategoryLabel(post.category) }}
                                </span>
                                <time :datetime="post.date" class="mr-4">{{ post.date }}</time>
                                <span v-if="post.readTime">{{ post.readTime }} мин чтения</span>
                            </div>

                            <!-- Title -->
                            <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                {{ post.title }}
                            </h1>

                            <!-- Content -->
                            <div class="prose prose-lg max-w-none text-gray-700">
                                <p class="text-lg leading-relaxed mb-6">
                                    {{ post.excerpt }}
                                </p>

                                <div v-html="post.content" class="space-y-6"></div>
                            </div>

                            <!-- Tags -->
                            <div v-if="post.tags && post.tags.length" class="mt-8 pt-6 border-t border-gray-200">
                                <h3 class="text-lg font-semibold text-gray-900 mb-4">Теги</h3>
                                <div class="flex flex-wrap gap-2">
                                    <span v-for="tag in post.tags" :key="tag"
                                        class="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm cursor-pointer transition-colors">
                                        {{ tag }}
                                    </span>
                                </div>
                            </div>

                            <!-- Share -->
                            <div class="mt-6 pt-6 border-t border-gray-200">
                                <h3 class="text-lg font-semibold text-gray-900 mb-4">Поделиться</h3>
                                <div class="flex space-x-4">
                                    <button class="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors">
                                        <font-awesome-icon :icon="['fab', 'facebook-f']" />
                                    </button>
                                    <button class="w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center transition-colors">
                                        <font-awesome-icon :icon="['fab', 'twitter']" />
                                    </button>
                                    <button class="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors">
                                        <font-awesome-icon :icon="['fab', 'linkedin-in']" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>

                    <!-- Comments Section -->
                    <div class="mt-8 bg-white rounded-xl shadow-md p-8">
                        <h2 class="text-2xl font-bold text-gray-900 mb-6">Оставить комментарий</h2>

                        <!-- Comment Form -->
                        <form @submit.prevent="submitComment" class="mb-8">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input v-model="commentForm.name" type="text" placeholder="Имя*" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                                <input v-model="commentForm.email" type="email" placeholder="Email*" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                            </div>
                            <textarea v-model="commentForm.message" placeholder="Ваш комментарий*" required rows="4"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-4"></textarea>
                            <button type="submit"
                                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                Отправить комментарий
                            </button>
                        </form>

                        <!-- Comments List -->
                        <div class="space-y-6">
                            <h3 class="text-xl font-semibold text-gray-900">{{ comments.length }} Комментариев</h3>

                            <div v-for="comment in comments" :key="comment.id" class="border-b border-gray-200 pb-6">
                                <div class="flex items-start space-x-4">
                                    <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span class="text-blue-600 font-semibold">{{ comment.name.charAt(0) }}</span>
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex items-center space-x-2 mb-2">
                                            <h4 class="font-semibold text-gray-900">{{ comment.name }}</h4>
                                            <time class="text-sm text-gray-500">{{ comment.date }}</time>
                                        </div>
                                        <p class="text-gray-700 mb-3">{{ comment.message }}</p>
                                        <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                            Ответить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="lg:col-span-1">
                    <div class="sticky top-8 space-y-8">

                        <!-- Search -->
                        <div class="bg-white rounded-xl shadow-md p-6">
                            <h3 class="text-xl font-semibold text-gray-900 mb-4">Поиск</h3>
                            <div class="relative">
                                <input v-model="searchQuery" type="text" placeholder="В разработке..."
                                    class="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                                <button class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <font-awesome-icon :icon="['fas', 'search']" />
                                </button>
                            </div>
                        </div>

                        <!-- Categories -->
                        <div class="bg-white rounded-xl shadow-md p-6">
                            <h3 class="text-xl font-semibold text-gray-900 mb-4">Категории <span>В разработке...</span></h3>
                            <ul class="space-y-2">
                                <li v-for="category in categories" :key="category.name">
                                    <a href="#" class="flex items-center justify-between text-gray-600 hover:text-blue-600 transition-colors py-2">
                                        <span>{{ category.name }}</span>
                                        <span class="text-sm text-gray-400">({{ category.count }})</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <!-- Recent Articles -->
                        <div class="bg-white rounded-xl shadow-md p-6">
                            <h3 class="text-xl font-semibold text-gray-900 mb-4">Последние статьи</h3>
                            <div class="space-y-4">
                                <router-link 
                                    v-for="article in recentArticles" 
                                    :key="article.id" 
                                    :to="{ name: 'blog-detail', params: { id: article.id } }"
                                    class="flex space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                >
                                    <img :src="article.image || 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400'"
                                        :alt="article.title"
                                        class="w-16 h-16 rounded-lg object-cover flex-shrink-0">
                                    <div>
                                        <h4 class="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2">
                                            {{ article.title }}
                                        </h4>
                                        <p class="text-xs text-gray-500 mt-1">{{ article.date }}</p>
                                    </div>
                                </router-link>
                            </div>
                        </div>

                        <!-- Popular Tags -->
                        <div class="bg-white rounded-xl shadow-md p-6">
                            <h3 class="text-xl font-semibold text-gray-900 mb-4">Популярные теги</h3>
                            <div class="flex flex-wrap gap-2">
                                <span v-for="tag in popularTags" :key="tag"
                                    class="inline-block bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 px-3 py-1 rounded-lg text-sm cursor-pointer transition-colors">
                                    {{ tag }}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const post = ref({})
const searchQuery = ref('')
const videoPlayer = ref(null)
const videoAspectRatio = ref('16/9')
const commentForm = ref({
    name: '',
    email: '',
    message: ''
})

// Все посты (те же данные что и в Blog.vue)
const allPosts = [
    // Видео материалы
    {
        id: 1,
        title: "Инструкция по применению Durosil",
        excerpt: "Пошаговое видео-руководство по использованию Durosil в стоматологической практике.",
        video: "/albadent/video/durosil-instruktion.MOV",
        author: "AlbaDent",
        date: "01 Ноя 2025",
        category: "video",
        type: "video",
        duration: "08:12",
        thumbnailTime: 3,
        readTime: 8,
        tags: ['Durosil', 'Инструкция', 'Видео', 'Стоматология'],
        content: `
            <h2>О материале Durosil</h2>
            <p>Durosil - это высококачественный силиконовый оттискной материал, который широко используется в современной стоматологии для создания точных слепков.</p>
            
            <h3>Основные характеристики</h3>
            <ul>
                <li>Высокая точность воспроизведения деталей</li>
                <li>Отличная размерная стабильность</li>
                <li>Удобство в работе</li>
                <li>Быстрое время схватывания</li>
            </ul>

            <h3>Применение</h3>
            <p>Материал идеально подходит для изготовления коронок, мостов, вкладок и других ортопедических конструкций. Рекомендуется использовать совместно с адгезивами для достижения наилучших результатов.</p>
        `
    },
    {
        id: 2,
        title: "Dynamic Plus — видеоруководство 1",
        excerpt: "Показана техника работы с композитом Dynamic Plus для реставраций передних и жевательных зубов.",
        video: "/albadent/video/dynamic-plus-2.MP4",
        author: "AlbaDent",
        date: "05 Ноя 2025",
        category: "video",
        type: "video",
        duration: "10:05",
        thumbnailTime: 5,
        readTime: 10,
        tags: ['Dynamic Plus', 'Композит', 'Реставрация', 'Видео'],
        content: `
            <h2>Композит Dynamic Plus</h2>
            <p>Dynamic Plus представляет собой универсальный композитный материал нового поколения с улучшенными эстетическими и физическими свойствами.</p>
            
            <h3>Преимущества материала</h3>
            <ul>
                <li>Широкая цветовая палитра</li>
                <li>Высокая прочность</li>
                <li>Отличная полируемость</li>
                <li>Устойчивость к износу</li>
            </ul>

            <h3>Техника работы</h3>
            <p>В видео детально показана послойная техника нанесения композита, что позволяет достичь максимальной естественности и долговечности реставрации.</p>
        `
    },
    {
        id: 3,
        title: "Dynamic Plus — видеоруководство 2",
        excerpt: "Дополнительное видео по использованию Dynamic Plus, фокус на тонкий слой и адаптацию композита.",
        video: "/albadent/video/dynamic-plus.MP4",
        author: "AlbaDent",
        date: "06 Ноя 2025",
        category: "video",
        type: "video",
        duration: "09:30",
        thumbnailTime: 2,
        readTime: 9,
        tags: ['Dynamic Plus', 'Композит', 'Техника', 'Адаптация'],
        content: `
            <h2>Техника адаптации композита</h2>
            <p>В этом видео подробно рассматривается техника нанесения тонких слоев композита для достижения оптимальной адаптации материала к тканям зуба.</p>
        `
    },
    {
        id: 4,
        title: "ExTracem — фиксация коронок",
        excerpt: "Видео-инструкция по применению стеклоиономерного цемента ExTracem для фиксации коронок и мостов.",
        video: "/albadent/video/extracem.MP4",
        author: "AlbaDent",
        date: "07 Ноя 2025",
        category: "video",
        type: "video",
        duration: "07:45",
        thumbnailTime: 4,
        readTime: 7,
        tags: ['ExTracem', 'Цемент', 'Фиксация', 'Коронки'],
        content: `
            <h2>Стеклоиономерный цемент ExTracem</h2>
            <p>ExTracem - это современный стеклоиономерный цемент для постоянной фиксации ортопедических конструкций.</p>
        `
    },
    {
        id: 5,
        title: "Курсы и конгрессы AlbaDent",
        excerpt: "Обзор прошедших образовательных мероприятий: курсы и конгрессы для стоматологов.",
        video: "/albadent/video/kurs-va-kongresslar.MP4",
        author: "AlbaDent",
        date: "10 Ноя 2025",
        category: "education",
        type: "video",
        duration: "12:50",
        thumbnailTime: 6,
        readTime: 12,
        tags: ['Образование', 'Курсы', 'Конгресс', 'Обучение'],
        content: `
            <h2>Образовательные мероприятия AlbaDent</h2>
            <p>Компания AlbaDent регулярно проводит образовательные курсы и участвует в международных стоматологических конгрессах.</p>
        `
    },
    {
        id: 6,
        title: "STARK — Bulk Fill Composite",
        excerpt: "Видео по работе с микрогибридным композитом STARK для крупных реставраций.",
        video: "/albadent/video/stark.MOV",
        author: "AlbaDent",
        date: "11 Ноя 2025",
        category: "video",
        type: "video",
        duration: "08:40",
        thumbnailTime: 3,
        readTime: 8,
        tags: ['STARK', 'Bulk Fill', 'Композит', 'Реставрация'],
        content: `
            <h2>Композит STARK Bulk Fill</h2>
            <p>STARK - это микрогибридный композит для техники Bulk Fill, позволяющий вносить материал слоем до 4-5 мм.</p>
        `
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
        thumbnailTime: 2,
        readTime: 5,
        tags: ['Новости', 'AlbaDent', 'События'],
        content: `
            <h2>Последние новости</h2>
            <p>Актуальные новости и события из мира стоматологии и деятельности компании AlbaDent.</p>
        `
    },
    {
        id: 8,
        title: "Zenchroma — универсальный композит",
        excerpt: "Видео-инструкция по применению универсального композита Zenchroma для реставраций передних и жевательных зубов.",
        video: "/albadent/video/zechroma.MP4",
        author: "AlbaDent",
        date: "14 Ноя 2025",
        category: "video",
        type: "video",
        duration: "09:55",
        thumbnailTime: 5,
        readTime: 10,
        tags: ['Zenchroma', 'Композит', 'Универсальный', 'Реставрация'],
        content: `
            <h2>Универсальный композит Zenchroma</h2>
            <p>Zenchroma - это универсальный нанокомпозит для реставраций передних и жевательных зубов с превосходными эстетическими свойствами.</p>
        `
    },
    {
        id: 9,
        title: "ZENIT LC — керамический композит",
        excerpt: "Пошаговое видео по работе с керамическим композитом Zenit LC для передних зубов.",
        video: "/albadent/video/zenit-ceramik-composit.MOV",
        author: "AlbaDent",
        date: "15 Ноя 2025",
        category: "video",
        type: "video",
        duration: "08:30",
        thumbnailTime: 4,
        readTime: 8,
        tags: ['ZENIT LC', 'Керамика', 'Композит', 'Эстетика'],
        content: `
            <h2>Керамический композит ZENIT LC</h2>
            <p>ZENIT LC - это композит с керамическим наполнителем для высокоэстетичных реставраций передних зубов.</p>
        `
    },
    {
        id: 10,
        title: "ZenitCem — готовый цемент",
        excerpt: "Инструкция по использованию готового цемента ZenitCem для фиксации реставраций.",
        video: "/albadent/video/zenitcem.MP4",
        author: "AlbaDent",
        date: "16 Ноя 2025",
        category: "education",
        type: "video",
        duration: "06:50",
        thumbnailTime: 3,
        readTime: 7,
        tags: ['ZenitCem', 'Цемент', 'Фиксация'],
        content: `
            <h2>Готовый цемент ZenitCem</h2>
            <p>ZenitCem - это готовый к применению цемент для фиксации различных ортопедических конструкций.</p>
        `
    },

    // Обучающие материалы
    {
        id: 11,
        title: "Основы стоматологической имплантации",
        excerpt: "Комплексный обучающий курс по планированию и проведению имплантации зубов с использованием современных материалов.",
        image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800",
        author: "Администратор",
        date: "08 Янв 2025",
        category: "education",
        type: "article",
        readTime: 15,
        tags: ['Имплантация', 'Обучение', 'Хирургия', 'Материалы'],
        content: `
            <h2>Введение в имплантологию</h2>
            <p>Имплантация зубов является одним из наиболее эффективных методов восстановления утраченных зубов в современной стоматологии.</p>
            
            <h3>Планирование имплантации</h3>
            <p>Успешная имплантация начинается с тщательного планирования, включающего компьютерную томографию, оценку костной ткани и выбор оптимального типа имплантата.</p>
        `
    },
    {
        id: 12,
        title: "Современные композитные материалы: выбор и применение",
        excerpt: "Подробный гайд по выбору композитных материалов для различных клинических ситуаций.",
        image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800",
        author: "Администратор",
        date: "05 Янв 2025",
        category: "education",
        type: "article",
        readTime: 12,
        tags: ['Композиты', 'Материалы', 'Реставрация', 'Выбор'],
        content: `
            <h2>Классификация композитов</h2>
            <p>Современные композитные материалы делятся на несколько категорий в зависимости от размера частиц наполнителя и области применения.</p>
        `
    },
    {
        id: 13,
        title: "Протоколы стерилизации в стоматологии",
        excerpt: "Актуальные протоколы и стандарты стерилизации инструментов и оборудования в стоматологической практике.",
        image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800",
        author: "Администратор",
        date: "03 Янв 2025",
        category: "education",
        type: "article",
        readTime: 10,
        tags: ['Стерилизация', 'Протоколы', 'Безопасность', 'Гигиена'],
        content: `
            <h2>Важность стерилизации</h2>
            <p>Правильная стерилизация инструментов - это основа безопасной стоматологической практики и предотвращения инфекций.</p>
        `
    },

    // Инструкции
    {
        id: 14,
        title: "Инструкция по эксплуатации рентген-аппарата",
        excerpt: "Пошаговое руководство по безопасной эксплуатации и обслуживанию стоматологического рентген-оборудования.",
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800",
        author: "Администратор",
        date: "01 Янв 2025",
        category: "instruction",
        type: "article",
        readTime: 8,
        tags: ['Рентген', 'Оборудование', 'Инструкция', 'Безопасность'],
        content: `
            <h2>Безопасная работа с рентген-аппаратом</h2>
            <p>Рентгенологическое оборудование требует соблюдения строгих правил эксплуатации и техники безопасности.</p>
        `
    },
    {
        id: 15,
        title: "Настройка и калибровка автоклава: руководство",
        excerpt: "Детальная инструкция по правильной настройке, калибровке и техническому обслуживанию автоклава.",
        image: "https://images.unsplash.com/photo-1581594549595-35f6edc7b762?w=800",
        author: "Администратор",
        date: "28 Дек 2024",
        category: "instruction",
        type: "article",
        readTime: 10,
        tags: ['Автоклав', 'Калибровка', 'Инструкция', 'Обслуживание'],
        content: `
            <h2>Настройка автоклава</h2>
            <p>Правильная настройка и регулярная калибровка автоклава обеспечивают эффективность стерилизации.</p>
        `
    },
    {
        id: 16,
        title: "Правила работы с композитными светильниками",
        excerpt: "Инструкция по безопасному использованию фотополимеризационных ламп и уходу за ними.",
        image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800",
        author: "Администратор",
        date: "25 Дек 2024",
        category: "instruction",
        type: "article",
        readTime: 6,
        tags: ['Полимеризация', 'Лампы', 'Безопасность', 'Инструкция'],
        content: `
            <h2>Фотополимеризационные лампы</h2>
            <p>Правильное использование полимеризационных ламп критично для качества композитных реставраций.</p>
        `
    },

    // Новости
    {
        id: 17,
        title: "AlbaDent представляет новую линейку продуктов",
        excerpt: "Мы рады объявить о расширении нашего ассортимента премиальными стоматологическими материалами европейского качества.",
        image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=800",
        author: "Администратор",
        date: "20 Дек 2024",
        category: "news",
        type: "article",
        readTime: 5,
        tags: ['Новости', 'Продукты', 'AlbaDent', 'Анонс'],
        content: `
            <h2>Расширение ассортимента</h2>
            <p>Компания AlbaDent рада представить новую линейку премиальных стоматологических материалов от ведущих европейских производителей.</p>
        `
    },
    {
        id: 18,
        title: "Итоги международной конференции по стоматологии",
        excerpt: "Наша команда приняла участие в крупнейшей международной выставке стоматологического оборудования.",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
        author: "Администратор",
        date: "18 Дек 2024",
        category: "news",
        type: "article",
        readTime: 7,
        tags: ['Конференция', 'Выставка', 'Новости', 'События'],
        content: `
            <h2>Международная выставка</h2>
            <p>Команда AlbaDent посетила крупнейшую международную выставку стоматологического оборудования и материалов.</p>
        `
    },
    {
        id: 19,
        title: "Специальное предложение на зимний сезон",
        excerpt: "Воспользуйтесь выгодными условиями на популярные позиции стоматологических материалов и инструментов.",
        image: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=800",
        author: "Администратор",
        date: "15 Дек 2024",
        category: "news",
        type: "article",
        readTime: 4,
        tags: ['Акция', 'Скидки', 'Предложение', 'Зима'],
        content: `
            <h2>Зимнее предложение</h2>
            <p>Специальные условия на популярные стоматологические материалы и инструменты в зимний период.</p>
        `
    }
];

const comments = ref([
    {
        id: 1,
        name: 'Иван Петров',
        date: '15 Янв 2025',
        message: 'Отличная статья! Очень полезная информация для практикующих стоматологов.'
    },
    {
        id: 2,
        name: 'Мария Сидорова',
        date: '14 Янв 2025',
        message: 'Спасибо за подробное объяснение. Буду применять эти знания в своей работе.'
    }
])

const categories = ref([
    { name: 'Видео материалы', count: 10 },
    { name: 'Обучающие курсы', count: 3 },
    { name: 'Инструкции', count: 3 },
    { name: 'Новости', count: 3 }
])

const recentArticles = computed(() => {
    return allPosts
        .filter(p => p.id !== post.value.id)
        .slice(0, 3)
})

const popularTags = ref([
    'Стоматология', 'Имплантация', 'Оборудование', 'Обучение',
    'Инструкции', 'Материалы', 'Протоколы', 'Видео'
])

const submitComment = () => {
    console.log('Comment submitted:', commentForm.value)
    commentForm.value = { name: '', email: '', message: '' }
}

const getCategoryClass = (category) => {
    const classes = {
        video: 'bg-red-500 text-white',
        education: 'bg-green-500 text-white',
        instruction: 'bg-purple-500 text-white',
        news: 'bg-blue-500 text-white'
    }
    return classes[category] || 'bg-gray-500 text-white'
}

const getCategoryLabel = (category) => {
    const labels = {
        video: 'Видео',
        education: 'Обучение',
        instruction: 'Инструкция',
        news: 'Новость'
    }
    return labels[category] || 'Статья'
}

const toggleAspectRatio = () => {
    videoAspectRatio.value = videoAspectRatio.value === '16/9' ? '9/16' : '16/9'
}

const onVideoLoaded = () => {
    console.log('Video loaded')
}

const loadPost = (id) => {
    const foundPost = allPosts.find(p => p.id === parseInt(id))
    if (foundPost) {
        post.value = foundPost
    } else {
        post.value = allPosts[0] // Fallback
    }
}

onMounted(() => {
    const postId = route.params.id
    if (postId) {
        loadPost(postId)
    }

    if (window.AOS) {
        setTimeout(() => window.AOS.refresh(), 100)
    }
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    --webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.prose h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-top: 2rem;
    margin-bottom: 1rem;
}

.prose h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
}

.prose p {
    margin-bottom: 1rem;
    line-height: 1.75;
}

.prose ul {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    list-style-type: disc;
}

.prose li {
    margin-bottom: 0.5rem;
}
</style>