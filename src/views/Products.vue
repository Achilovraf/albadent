<template>
  <div class="min-h-screen bg-gray-50">
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />

    <!-- Компонент корзины -->
    <Cart />

    <!-- Быстрый просмотр Modal -->
    <div
      v-if="quickViewProduct"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="closeQuickView"
    >
      <div class="absolute inset-0 bg-black bg-opacity-60" @click="closeQuickView"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto z-10">
        <!-- Закрыть -->
        <button
          @click="closeQuickView"
          class="absolute top-4 right-4 z-20 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center transition-all"
        >
          <i class="fas fa-times"></i>
        </button>

        <div class="flex flex-col md:flex-row">
          <!-- Изображение -->
          <div class="md:w-1/2 bg-gray-50 rounded-tl-2xl rounded-bl-2xl flex items-center justify-center p-8">
            <img
              :src="quickViewProduct.image"
              :alt="quickViewProduct.name"
              class="w-full max-h-72 object-contain"
            />
          </div>

          <!-- Информация -->
          <div class="md:w-1/2 p-6 flex flex-col">
            <!-- Бейдж -->
            <span
              :class="[
                'text-white text-xs font-semibold px-3 py-1 rounded-full self-start mb-3',
                quickViewProduct.category === 'dmg' ? 'bg-orange-500' : 'bg-blue-600'
              ]"
            >
              {{ getCategoryName(quickViewProduct.category) }}
            </span>

            <h2 class="text-xl font-bold text-gray-900 mb-2">{{ quickViewProduct.name }}</h2>

            <!-- Производитель -->
            <div v-if="quickViewProduct.manufacturer" class="flex items-center gap-1 mb-3 text-sm text-gray-500">
              <i class="fas fa-industry text-blue-500"></i>
              <span>{{ quickViewProduct.manufacturer }}</span>
            </div>

            <!-- Рейтинг -->
            <div class="flex items-center gap-2 mb-3">
              <div class="flex gap-1">
                <i
                  v-for="n in 5"
                  :key="n"
                  :class="['fas fa-star text-sm', n <= Math.round(quickViewProduct.rating) ? 'text-yellow-400' : 'text-gray-200']"
                ></i>
              </div>
              <span class="text-sm font-semibold text-gray-700">{{ quickViewProduct.rating }}</span>
              <span class="text-sm text-gray-400">({{ quickViewProduct.reviews }} отзывов)</span>
            </div>

            <p class="text-sm text-gray-600 mb-4">{{ quickViewProduct.description }}</p>

            <!-- Применение -->
            <div v-if="quickViewProduct.usage" class="mb-4">
              <h4 class="text-sm font-bold text-gray-800 mb-1">
                <i class="fas fa-info-circle text-blue-500 mr-1"></i>Применение:
              </h4>
              <p class="text-sm text-gray-600">{{ quickViewProduct.usage }}</p>
            </div>

            <!-- Преимущества -->
            <div v-if="quickViewProduct.advantages && quickViewProduct.advantages.length" class="mb-4">
              <h4 class="text-sm font-bold text-gray-800 mb-2">
                <i class="fas fa-check-circle text-green-500 mr-1"></i>Преимущества:
              </h4>
              <ul class="space-y-1">
                <li
                  v-for="adv in quickViewProduct.advantages"
                  :key="adv"
                  class="flex items-start gap-2 text-sm text-gray-600"
                >
                  <i class="fas fa-check text-green-500 mt-0.5 flex-shrink-0"></i>
                  {{ adv }}
                </li>
              </ul>
            </div>

            <!-- Конкурент -->
            <div v-if="quickViewProduct.competitor && quickViewProduct.competitor !== '-'" class="mb-4 text-sm text-gray-500">
              <i class="fas fa-exchange-alt text-gray-400 mr-1"></i>
              Аналог: <span class="font-semibold">{{ quickViewProduct.competitor }}</span>
            </div>

            <!-- Срок годности -->
            <div v-if="quickViewProduct.shelfLife" class="mb-4 text-sm text-gray-500">
              <i class="fas fa-calendar-alt text-gray-400 mr-1"></i>
              Срок годности: <span class="font-semibold">{{ quickViewProduct.shelfLife }}</span>
            </div>

            <!-- Цена и кнопки -->
            <div class="mt-auto">
              <div class="mb-4">
                <span class="text-3xl font-bold text-blue-600">Цена по запросу</span>
              </div>
              <div class="flex gap-3">
                <button
                  @click="addToCart(quickViewProduct); closeQuickView()"
                  class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 active:scale-95 transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <i class="fas fa-shopping-cart"></i>
                  В корзину
                </button>
                <button
                  @click="toggleWishlist(quickViewProduct)"
                  :class="[
                    'px-4 py-3 rounded-lg border-2 flex items-center justify-center transition-all',
                    quickViewProduct.inWishlist
                      ? 'text-red-600 border-red-600 bg-red-50'
                      : 'text-gray-600 border-gray-300 hover:border-red-600 hover:text-red-600',
                  ]"
                >
                  <i :class="quickViewProduct.inWishlist ? 'fas fa-heart' : 'far fa-heart'"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Заголовок -->
    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Каталог продукции AlbaDent
          test test test 
        </h1>
        <p class="text-gray-600 text-lg">
          Высококачественные стоматологические материалы
        </p>
      </div>
    </section>

    <!-- Категории и товары -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4">

        <!-- Категории -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Категории</h2>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="selectCategory(category.id)"
              :class="[
                'px-6 py-3 rounded-lg font-semibold transition-all',
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300',
              ]"
            >
              {{ category.name }}
              <span class="ml-2 text-sm opacity-75">({{ category.count }})</span>
            </button>
          </div>
        </div>

        <!-- Управление -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-4 rounded-lg shadow">
          <div class="text-gray-700 font-semibold">
            Показано
            <span class="text-blue-600">{{ paginatedProducts.length }}</span> из
            <span class="text-blue-600">{{ filteredProducts.length }}</span>
            товаров
          </div>
          <div class="flex items-center gap-4">
            <label class="text-gray-700 font-medium">Сортировка:</label>
            <select
              v-model="sortBy"
              @change="sortProducts"
              class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="popularity">По популярности</option>
              <option value="price-low">Цена: по возрастанию</option>
              <option value="price-high">Цена: по убыванию</option>
              <option value="rating">По рейтингу</option>
              <option value="name">По названию (А-Я)</option>
            </select>
          </div>
        </div>

        <!-- Сетка товаров -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div
            v-for="product in paginatedProducts"
            :key="product.id"
            class="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 p-4 relative flex flex-col h-full group"
          >
            <!-- Бейдж категории -->
            <div class="absolute top-4 left-4 z-10">
              <span
                :class="[
                  'text-white text-xs font-semibold px-3 py-1 rounded-full',
                  product.category === 'dmg' ? 'bg-orange-500' : 'bg-blue-600'
                ]"
              >
                {{ getCategoryName(product.category) }}
              </span>
            </div>

            <!-- Изображение -->
            <div class="h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden flex-shrink-0 relative">
              <img
                :src="product.image"
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                @error="onImgError($event)"
              />
              <!-- Быстрый просмотр -->
              <div
                class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center"
              >
                <button
                  @click="openQuickView(product)"
                  class="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-lg"
                >
                  <i class="fas fa-eye mr-2"></i>Быстрый просмотр
                </button>
              </div>
            </div>

            <!-- Информация -->
            <div class="flex-grow flex flex-col">
              <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {{ product.name }}
              </h3>
              <p class="text-sm text-gray-600 mb-3 flex-grow line-clamp-3">
                {{ product.description }}
              </p>

              <!-- Производитель -->
              <div v-if="product.manufacturer" class="flex items-center gap-1 mb-2 text-xs text-gray-500">
                <i class="fas fa-industry text-blue-500"></i>
                <span>{{ product.manufacturer }}</span>
              </div>

              <!-- Характеристики -->
              <div class="flex items-center gap-4 mb-4 text-sm text-gray-500">
                <div class="flex items-center gap-1">
                  <i class="fas fa-box text-blue-600"></i>
                  <span>В наличии</span>
                </div>
                <div class="flex items-center gap-1">
                  <i class="fas fa-star text-yellow-400"></i>
                  <span class="font-semibold text-gray-700">{{ product.rating }}</span>
                  <span>({{ product.reviews }})</span>
                </div>
              </div>

              <!-- Цена -->
              <div class="flex items-center justify-between mb-4">
                <div>
                  <span class="text-xl font-bold text-blue-600">Цена по запросу</span>
                </div>
              </div>

              <!-- Кнопки -->
              <div class="flex gap-2 mt-auto">
                <button
                  @click="addToCart(product)"
                  class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
                >
                  <i class="fas fa-shopping-cart"></i>
                  В корзину
                </button>
                <button
                  @click="toggleWishlist(product)"
                  :class="[
                    'px-4 py-3 rounded-lg border-2 flex items-center justify-center transition-all duration-200',
                    product.inWishlist
                      ? 'text-red-600 border-red-600 bg-red-50'
                      : 'text-gray-600 border-gray-300 hover:border-red-600 hover:text-red-600',
                  ]"
                >
                  <i :class="product.inWishlist ? 'fas fa-heart' : 'far fa-heart'"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Пагинация -->
        <div v-if="totalPages > 1" class="flex flex-col items-center gap-6">
          <div class="flex justify-center gap-2 flex-wrap">
            <button
              v-if="currentPage > 1"
              @click="goToPage(currentPage - 1)"
              class="px-4 py-2 rounded-lg bg-white border-2 border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 flex items-center gap-2 font-semibold"
            >
              <i class="fas fa-chevron-left"></i> Назад
            </button>
            <button v-if="currentPage > 3" @click="goToPage(1)" :class="pageButtonClass(1)">1</button>
            <span v-if="currentPage > 4" class="px-4 py-2 text-gray-500">...</span>
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="pageButtonClass(page)"
            >{{ page }}</button>
            <span v-if="currentPage < totalPages - 3" class="px-4 py-2 text-gray-500">...</span>
            <button v-if="currentPage < totalPages - 2" @click="goToPage(totalPages)" :class="pageButtonClass(totalPages)">{{ totalPages }}</button>
            <button
              v-if="currentPage < totalPages"
              @click="goToPage(currentPage + 1)"
              class="px-4 py-2 rounded-lg bg-white border-2 border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 flex items-center gap-2 font-semibold"
            >
              Вперед <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          <div class="text-gray-600 text-sm">
            Страница <span class="font-bold text-blue-600">{{ currentPage }}</span> из
            <span class="font-bold text-blue-600">{{ totalPages }}</span>
          </div>
        </div>

        <!-- Пустой результат -->
        <div v-if="filteredProducts.length === 0" class="text-center py-16">
          <i class="fas fa-box-open text-gray-300 text-6xl mb-4"></i>
          <h3 class="text-2xl font-bold text-gray-700 mb-2">Товары не найдены</h3>
          <p class="text-gray-500 mb-6">Попробуйте выбрать другую категорию</p>
          <button @click="selectCategory('all')" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Показать все товары
          </button>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import Cart from "../components/Cart.vue";
import { useCart } from "../composables/useCart";

// ==============================
// Импорт изображений DMG
// ==============================
import imgHonigumLight from "@/assets/images/products/DMG-Honigum_Light.jpg";
import imgHonigumPuttySoft from "@/assets/images/products/photo_2024-12-06_12-36-34.png";
import imgHonigumProPutty from "@/assets/images/products/Honigum-Pro-Putty-Soft.jpg";
import imgLuxatempPlus from "@/assets/images/products/Luxatemp_AMPLus_RGB__20257.jpg";
import imgLuxatempGun from "@/assets/images/products/1031406_UK_Front_01_s_-Luxatemp-Automix-Gun-101.avif";
import imgAutomixDispenser from "@/assets/images/products/automix-dispenser-dmg-pistolet-dispenser-dlya-silagum-honigum-1.1800x1200w.jpg";
import imgHonigumLightBox from "@/assets/images/products/i6xuszss9rp2gjt2wrimrgwionf951qq.png";
import imgSaadDmg from "@/assets/images/products/40_23_SAAD_DMG_10-1068x827.jpg";

const { addToCart: addToCartStore } = useCart();

const products = ref([]);
const sortBy = ref("popularity");
const currentPage = ref(1);
const itemsPerPage = 8;
const selectedCategory = ref("all");
const quickViewProduct = ref(null);

// ==============================
// КАТЕГОРИИ
// ==============================
const categories = ref([
  { id: "all", name: "Все товары", count: 0 },
  { id: "president", name: "President Dental", count: 0 },
  { id: "dmg", name: "DMG", count: 0 },
]);

// ==============================
// ВСЕ ТОВАРЫ
// ==============================
const mockProducts = [
  // -----------------------------------------------
  // ОБЩИЕ ТОВАРЫ
  // -----------------------------------------------
  {
    id: 1,
    name: "Септодонт Ультракаин ДС Форте",
    description: "Местный анестетик для стоматологических процедур с адреналином 1:100000",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    currentPrice: 2850,
    oldPrice: 3200,
    rating: 4.8,
    reviews: 124,
    inWishlist: false,
    category: "all",
  },
  {
    id: 2,
    name: "Композитный пломбировочный материал Filtek Z350 XT",
    description: "Нанокомпозитный материал для эстетических реставраций передних и боковых зубов",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
    currentPrice: 5450,
    rating: 4.9,
    reviews: 89,
    inWishlist: false,
    category: "all",
  },
  {
    id: 3,
    name: "Стоматологический бор алмазный набор",
    description: "Набор алмазных боров для препарирования полостей различной формы и размера",
    image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=400&fit=crop",
    currentPrice: 1250,
    rating: 4.6,
    reviews: 67,
    inWishlist: false,
    category: "all",
  },
  {
    id: 4,
    name: "Адгезивная система OptiBond FL",
    description: "Двухкомпонентная адгезивная система для надежной фиксации композитных пломб",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop",
    currentPrice: 3200,
    rating: 4.7,
    reviews: 156,
    inWishlist: true,
    category: "all",
  },
  {
    id: 5,
    name: "Эндодонтические файлы ProTaper Universal",
    description: "Никель-титановые файлы для механической обработки корневых каналов",
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=400&fit=crop",
    currentPrice: 4100,
    oldPrice: 4500,
    rating: 4.8,
    reviews: 203,
    inWishlist: false,
    category: "all",
  },
  {
    id: 6,
    name: "Стеклоиономерный цемент Fuji IX GP",
    description: "Упрочненный стеклоиономерный цемент для постоянных пломб в области жевательных зубов",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=400&fit=crop",
    currentPrice: 2750,
    rating: 4.5,
    reviews: 98,
    inWishlist: false,
    category: "all",
  },
  {
    id: 7,
    name: "Коффердам система OptraDam Plus",
    description: "Полная система коффердама для изоляции рабочего поля во время лечения",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=400&fit=crop",
    currentPrice: 1890,
    rating: 4.4,
    reviews: 45,
    inWishlist: false,
    category: "all",
  },
  {
    id: 8,
    name: "Полировочные диски Sof-Lex",
    description: "Набор полировочных дисков различной абразивности для финишной обработки пломб",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=400&fit=crop",
    currentPrice: 950,
    rating: 4.6,
    reviews: 178,
    inWishlist: false,
    category: "all",
  },

  // -----------------------------------------------
  // PRESIDENT DENTAL
  // -----------------------------------------------
  {
    id: 101,
    name: "ExTracem",
    description: "Стеклоиономерный фиксирующий цемент для цементирования коронок, мостовидных протезов, вкладок, штифтов и ортодонтических колец.",
    image: "/albadent/images/products/extracem.jpeg",
    currentPrice: 880000,
    oldPrice: null,
    rating: 4.9,
    reviews: 12,
    inWishlist: false,
    category: "president",
    manufacturer: "President Dental (Германия)",
    shelfLife: "07/2027",
    usage: "Для фиксации временных и постоянных коронок. 1 ложка порошка + 2 капли жидкости, смешивать 30 секунд, застывает за 3,5 минуты.",
    advantages: [
      "Фторвыделяющий — предотвращает вторичный кариес",
      "Биосовместим, не раздражает пульпу",
      "Умеренная растворимость во влажной среде",
      "Прост в смешивании и нанесении",
    ],
    competitor: "FUJI",
  },
  {
    id: 102,
    name: "ProCem",
    description: "Цемент для фиксации несъёмных реставраций: коронки, мосты, вкладки, онлеи, виниры.",
    image: "/albadent/images/products/procem.jpeg",
    currentPrice: 560000,
    oldPrice: null,
    rating: 4.8,
    reviews: 10,
    inWishlist: false,
    category: "president",
    manufacturer: "President Dental (Германия)",
    shelfLife: "07/2027",
    usage: "Для временных и постоянных коронок. Без эвгенола, безопасен для пульпы.",
    advantages: [
      "Очень тонкий слой для точного позиционирования реставрации",
      "Высокая прочность и стабильность цвета",
      "Устойчив к растворению и жевательной нагрузке",
    ],
    competitor: "Tempond",
  },
  {
    id: 103,
    name: "ZENIT LC Nano Ceramic Composite",
    description: "Нано-керамический светополимеризующийся композит для передних зубов.",
    image: "/albadent/images/products/zenit.jpeg",
    currentPrice: 600000,
    oldPrice: null,
    rating: 4.9,
    reviews: 15,
    inWishlist: false,
    category: "president",
    manufacturer: "President Dental (Германия)",
    shelfLife: "07/2027",
    usage: "Для передних зубов.",
    advantages: [
      "Высокая прочность и износостойкость",
      "Хамелеон-эффект — идеально подстраивается под цвет зуба",
      "Минимальная усадка (1.8%)",
      "Отличное полирование и устойчивость к пятнам",
      "Удобная консистенция — не растекается и не прилипает к инструменту",
      "Биосовместим и устойчив к влаге",
    ],
    competitor: "Estelite Asteria",
  },
  {
    id: 104,
    name: "STARK – Microhybrid Bulk Fill Composite",
    description: "Светополимеризующийся микрогибридный композит для больших реставраций.",
    image: "/albadent/images/products/stark.jpeg",
    currentPrice: 600000,
    oldPrice: null,
    rating: 4.8,
    reviews: 11,
    inWishlist: false,
    category: "president",
    manufacturer: "President Dental (Германия)",
    shelfLife: "07/2027",
    usage: "Для I и II класса реставраций, базовый слой под эстетическую реставрацию, восстановление жевательных зубов.",
    advantages: [
      "Можно заполнять до 4 мм за один слой",
      "Высокая прочность и износостойкость",
      "Не растекается и легко формуется",
      "Без Bis-GMA — безопасно и биосовместимо",
      "Глубокое и равномерное отверждение",
    ],
    competitor: "нет",
  },
  {
    id: 105,
    name: "ZENCHROMA – Universal Composite",
    description: "Универсальный светополимеризующийся композит, один оттенок подходит для всех 16 цветов системы VITA.",
    image: "/albadent/images/products/zenchroma.jpeg",
    currentPrice: 600000,
    oldPrice: 480000,
    rating: 4.9,
    reviews: 18,
    inWishlist: false,
    category: "president",
    manufacturer: "President Dental (Германия)",
    shelfLife: "07/2027",
    usage: "Для реставраций I–V классов, виниров, инлеев, онлеев, эстетических реставраций и коррекции цвета.",
    advantages: [
      "Хамелеон-эффект — подстраивается под любой цвет зуба",
      "Высокая прочность и легкое полирование",
      "Универсальное применение для передних и жевательных зубов",
      "Экономит время и материалы — один шприц на все оттенки",
      "Биосовместим и не раздражает ткани",
    ],
    competitor: "нет",
  },
  {
    id: 106,
    name: "ZENIT COLOR",
    description: "Жидкие композитные краски, совместимые со всеми светополимеризующимися композитами.",
    image: "/albadent/images/products/zenit-color.jpeg",
    currentPrice: 600000,
    oldPrice: null,
    rating: 4.8,
    reviews: 9,
    inWishlist: false,
    category: "president",
    manufacturer: "President Dental (Германия)",
    shelfLife: "07/2027",
    usage: "Для создания естественных деталей зуба — трещин, прозрачности, фиссур, мамелонов и эффекта опалесценции.",
    advantages: [
      "Очень тонкая консистенция — легко наносится кистью",
      "Отличное отверждение и стабильный цвет",
      "Позволяет смешивать оттенки для получения нужного тона",
      "Совместим со всеми композитами и лаками",
      "После полимеризации образует прочный и блестящий слой",
    ],
    competitor: "нет",
  },
  {
    id: 107,
    name: "DYNAMIC FLOW – Flowable Composite",
    description: "Универсальный текучий светополимеризующийся композит для точного заполнения и герметизации полостей.",
    image: "/albadent/images/products/dynamic-flow.jpeg",
    currentPrice: 310000,
    oldPrice: null,
    rating: 4.7,
    reviews: 7,
    inWishlist: false,
    category: "president",
    manufacturer: "President Dental (Германия)",
    shelfLife: "07/2027",
    usage: "Для реставраций III и V классов, герметиков фиссур, базового слоя под композиты, ремонта композитов.",
    advantages: [
      "Низкая вязкость — равномерное распределение и отличная адгезия",
      "Высокая прочность и рентгеноконтрастность",
      "Не течет из полости",
      "Содержит ионы фтора, кальция и фосфата — помогает реминерализовать зубную ткань",
      "Совместим со всеми композитами President Dental",
      "Сохраняет цвет, устойчив к влаге и пятнам",
    ],
    competitor: "Estelite Palfique",
  },
  {
    id: 108,
    name: "DYNAMIC PLUS – Micro Hybrid Composite",
    description: "Универсальный светополимеризующийся микрогибридный композит для передних и жевательных зубов.",
    image: "/albadent/images/products/dynamic-plus.jpeg",
    currentPrice: 350000,
    oldPrice: null,
    rating: 4.8,
    reviews: 8,
    inWishlist: false,
    category: "president",
    manufacturer: "President Dental (Германия)",
    shelfLife: "07/2027",
    usage: "Для реставраций I–V классов, инлеев, онлеев, виниров и шеечных дефектов.",
    advantages: [
      "Высокое содержание наполнителя (~80%) — прочность и долговечность",
      "Микрогибридная структура (0.05–1 мкм) — идеальная адаптация и гладкая обработка",
      "Отличное полирование и естественный блеск",
      "Не растекается, легко формуется, не прилипает к инструменту",
      "Высокая рентгеноконтрастность",
      "Биосовместим, устойчив к износу и изменению цвета",
    ],
    competitor: "Estelite Palfique",
  },
  {
    id: 109,
    name: "ZENITCEM",
    description: "Готовый цемент-паста для фиксации реставраций.",
    image: "/albadent/images/products/zenitcem.jpeg",
    currentPrice: 1190000,
    oldPrice: null,
    rating: 4.8,
    reviews: 5,
    inWishlist: false,
    category: "president",
    manufacturer: "President Dental (Германия)",
    shelfLife: "07/2027",
    usage: "Готовая паста для цементирования. Простой в работе и биосовместим.",
    advantages: [
      "Удобство использования",
      "Надежное сцепление",
      "Биосовместим и безопасен для пульпы",
    ],
    competitor: "Yussem",
  },

  // -----------------------------------------------
  // DMG
  // -----------------------------------------------
  {
    id: 201,
    name: "Honigum Light",
    description: "VPS-материал для точных корригирующих оттисков. Течёт под давлением, стабилен в покое.",
    image: imgHonigumLight,
    currentPrice: 850000,
    oldPrice: null,
    rating: 4.9,
    reviews: 34,
    inWishlist: false,
    category: "dmg",
    manufacturer: "DMG (Германия)",
    usage: "Корригирующие и двойные оттиски. Применяется с Honigum Heavy и Honigum Putty.",
    advantages: [
      "Реологически активная матрица — течёт под давлением, стабилен без давления",
      "Не стекает и не капает при нанесении",
      "Фиксирует мельчайшие детали препаровки",
      "Хорошо работает во влажных условиях",
      "Натуральный медовый аромат — комфорт для пациента",
    ],
    competitor: "3M Express",
  },
  {
    id: 202,
    name: "Honigum Putty Soft",
    description: "VPS-материал путти-консистенции для ручного замешивания. Точные оттиски коронок, мостов, вкладок.",
    image: imgHonigumPuttySoft,
    currentPrice: 780000,
    oldPrice: null,
    rating: 4.8,
    reviews: 28,
    inWishlist: false,
    category: "dmg",
    manufacturer: "DMG (Германия)",
    usage: "Оттиски коронок, мостов, вкладок и накладок. Сэндвич-техника с Honigum Light.",
    advantages: [
      "Технология Snap-Set — долгое рабочее время + короткое время в полости рта",
      "Превосходное восстановление после деформации",
      "Отличная размерная стабильность",
      "Минимальный стресс при замешивании",
      "Высокий комфорт пациента",
    ],
    competitor: "Zhermack Zetaplus",
  },
  {
    id: 203,
    name: "Honigum Pro Putty",
    description: "Улучшенный VPS путти-материал с превосходной текучестью в субгингивальной зоне и максимальной точностью.",
    image: imgHonigumProPutty,
    currentPrice: 980000,
    oldPrice: null,
    rating: 4.9,
    reviews: 19,
    inWishlist: false,
    category: "dmg",
    manufacturer: "DMG (Германия)",
    usage: "Оттиски коронок, мостов, вкладок, накладок и имплантов. Применяется с Honigum Pro Light.",
    advantages: [
      "Улучшенная гидрофильность — проникает в субгингивальную зону",
      "Высокая прочность на разрыв — безопасное извлечение без деформации",
      "Snap-Set — гибкое время введения, быстрое отверждение",
      "Снижает влияние микродвижений на точность",
      "Идеально для имплантологических оттисков",
    ],
    competitor: "3M Imprint 4",
  },
  {
    id: 204,
    name: "Luxatemp Automix Plus",
    description: "Бис-акрил композит для изготовления временных коронок и мостов. Картриджная система автоматического смешивания.",
    image: imgLuxatempPlus,
    currentPrice: 1150000,
    oldPrice: null,
    rating: 4.9,
    reviews: 42,
    inWishlist: false,
    category: "dmg",
    manufacturer: "DMG (Германия)",
    usage: "Временные коронки, мосты, вкладки, накладки, виниры. Рабочее время: 45 сек. Отверждение в полости рта: 1–2 мин.",
    advantages: [
      "Минимальная усадка (0.45%) — не требует повторной коррекции краёв",
      "Высокая прочность на изгиб — подходит для долгосрочных временных работ",
      "Без запаха и жжения десны",
      "Устойчив к истиранию",
      "Высокая биосовместимость",
      "Естественный вид, совпадает с цветом зубов",
    ],
    competitor: "Protemp 4 (3M)",
  },
  {
    id: 205,
    name: "Luxatemp Automix Gun",
    description: "Профессиональный пистолет-диспенсер для картриджей Luxatemp и других материалов DMG.",
    image: imgLuxatempGun,
    currentPrice: 420000,
    oldPrice: null,
    rating: 4.7,
    reviews: 11,
    inWishlist: false,
    category: "dmg",
    manufacturer: "DMG (Германия)",
    usage: "Для работы с Luxatemp Automix Plus и всеми картриджами DMG объёмом 76 г.",
    advantages: [
      "Точная дозировка материала",
      "Эргономичная рукоятка",
      "Прочная конструкция",
      "Подходит для всех картриджей Luxatemp",
    ],
    competitor: "-",
  },
  {
    id: 206,
    name: "DMG Automix Dispenser Gun",
    description: "Профессиональный диспенсер для 50 мл картриджей DMG. Совместим с картриджами 1:1 и 4:1.",
    image: imgAutomixDispenser,
    currentPrice: 450000,
    oldPrice: null,
    rating: 4.8,
    reviews: 15,
    inWishlist: false,
    category: "dmg",
    manufacturer: "DMG (Германия)",
    usage: "Для работы с Honigum Light, Honigum Pro Light, Luxatemp Automix Plus и всеми 50 мл картриджами DMG.",
    advantages: [
      "Эргономичная рукоятка — удобно держать одной рукой",
      "Равномерное давление — экономия материала",
      "Совместим со всеми 50 мл картриджами DMG соотношения 1:1",
      "Прочный пластиковый корпус — долговечная служба",
      "Легко разбирается для чистки",
    ],
    competitor: "-",
  },
  {
    id: 207,
    name: "Honigum Light (упаковка)",
    description: "VPS оттискной материал Honigum Light в стандартной упаковке с двумя картриджами и смешивающими насадками.",
    image: imgHonigumLightBox,
    currentPrice: 920000,
    oldPrice: null,
    rating: 4.9,
    reviews: 22,
    inWishlist: false,
    category: "dmg",
    manufacturer: "DMG (Германия)",
    usage: "Стандартная упаковка для клиник с высокой нагрузкой. Два картриджа по 50 мл + насадки.",
    advantages: [
      "Экономичная упаковка",
      "Полный комплект для работы",
      "Идеален для активных клиник",
      "Все преимущества Honigum Light",
    ],
    competitor: "3M Express",
  },
  {
    id: 208,
    name: "DMG продукция — обзор линейки",
    description: "Полная линейка оттискных и временных материалов DMG для профессиональной стоматологии.",
    image: imgSaadDmg,
    currentPrice: 0,
    oldPrice: null,
    rating: 5.0,
    reviews: 3,
    inWishlist: false,
    category: "dmg",
    manufacturer: "DMG (Германия)",
    usage: "Демонстрационный материал. Обратитесь к менеджеру для подбора нужных позиций.",
    advantages: [
      "Полная линейка от одного производителя",
      "Совместимость всех продуктов DMG",
      "Немецкое качество и надёжность",
    ],
    competitor: "-",
  },
];

// ==============================
// ВЫЧИСЛЯЕМЫЕ СВОЙСТВА
// ==============================
const filteredProducts = computed(() => {
  if (selectedCategory.value === "all") {
    return products.value;
  }
  return products.value.filter((p) => p.category === selectedCategory.value);
});

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const formatPrice = (price) => {
  if (!price) return "По запросу";
  return price.toLocaleString("ru-RU");
};

const pageButtonClass = (page) => {
  return [
    "px-4 py-2 rounded-lg transition-all duration-200 font-semibold min-w-[40px]",
    page === currentPage.value
      ? "bg-blue-600 text-white shadow-lg"
      : "bg-white border-2 border-gray-300 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600",
  ];
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId;
  currentPage.value = 1;
};

const getCategoryName = (categoryId) => {
  const category = categories.value.find((c) => c.id === categoryId);
  return category ? category.name : "Все товары";
};

const updateCategoryCounts = () => {
  categories.value.forEach((category) => {
    if (category.id === "all") {
      category.count = products.value.length;
    } else {
      category.count = products.value.filter((p) => p.category === category.id).length;
    }
  });
};

const sortProducts = () => {
  switch (sortBy.value) {
    case "price-low":
      products.value.sort((a, b) => a.currentPrice - b.currentPrice);
      break;
    case "price-high":
      products.value.sort((a, b) => b.currentPrice - a.currentPrice);
      break;
    case "rating":
      products.value.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      products.value.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      products.value.sort((a, b) => b.reviews - a.reviews);
  }
};

const addToCart = (product) => {
  addToCartStore(product);
};

const toggleWishlist = (product) => {
  product.inWishlist = !product.inWishlist;
};

// Быстрый просмотр
const openQuickView = (product) => {
  quickViewProduct.value = product;
  document.body.style.overflow = "hidden";
};

const closeQuickView = () => {
  quickViewProduct.value = null;
  document.body.style.overflow = "";
};

// Закрытие по ESC
const handleKeydown = (e) => {
  if (e.key === "Escape") closeQuickView();
};

// Fallback если изображение не загрузилось
const onImgError = (e) => {
  e.target.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop";
};

onMounted(() => {
  products.value = [...mockProducts];
  updateCategoryCounts();
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

input:focus,
select:focus {
  outline: none;
}

html {
  scroll-behavior: smooth;
}
</style>