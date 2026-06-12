<template>
    <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 py-8">
            <!-- Detail View -->
            <div v-if="currentView === 'detail' && selectedGallery">
                <!-- Navigation -->
                <div class="flex items-center justify-between mb-8" data-aos="fade-down">
                    <div class="flex items-center space-x-4">
                        <button @click="currentView = 'list'"
                            class="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                            <font-awesome-icon :icon="['fas', 'arrow-left']" />
                            <span>Вернуться к галереям</span>
                        </button>
                        <div class="text-gray-400">|</div>
                        <h1 class="text-2xl font-bold text-gray-900">{{ selectedGallery.title }}</h1>
                    </div>
                    <button @click="showUploadModal = true"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg">
                        <font-awesome-icon :icon="['fas', 'upload']" />
                        <span>Добавить файлы</span>
                    </button>
                </div>

                <!-- Gallery Info -->
                <div class="bg-white rounded-xl shadow-md p-6 mb-8" data-aos="fade-up">
                    <div class="flex items-center space-x-4 text-sm text-gray-600">
                        <div class="flex items-center space-x-2">
                            <font-awesome-icon :icon="['fas', 'calendar']" />
                            <span>{{ selectedGallery.date }}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <font-awesome-icon :icon="['fas', 'images']" />
                            <span>{{ selectedGallery.files.length }} файлов</span>
                        </div>
                    </div>
                    <p v-if="selectedGallery.description" class="mt-3 text-gray-700">
                        {{ selectedGallery.description }}
                    </p>
                </div>

                <!-- Files Grid -->
                <div v-if="selectedGallery.files.length > 0"
                    class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <div v-for="(file, index) in selectedGallery.files" :key="file.id"
                        class="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                        data-aos="zoom-in" :data-aos-delay="index * 50">
                        <div class="aspect-square overflow-hidden">
                            <div v-if="file.type === 'video'" class="relative w-full h-full bg-gray-900">
                                <video :src="file.url" class="w-full h-full object-cover" muted />
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="bg-black bg-opacity-50 rounded-full p-3">
                                        <font-awesome-icon :icon="['fas', 'play']" class="text-white text-xl" />
                                    </div>
                                </div>
                            </div>
                            <img v-else :src="file.url" :alt="file.name"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>

                        <!-- Action Overlay -->
                        <div
                            class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button @click="handleDeleteFile(file.id)"
                                class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors">
                                <font-awesome-icon :icon="['fas', 'trash']" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Empty State for Files -->
                <div v-else class="text-center py-16 bg-white rounded-xl" data-aos="fade-up">
                    <font-awesome-icon :icon="['fas', 'images']" class="text-6xl text-gray-300 mb-4" />
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Пока нет файлов</h3>
                    <p class="text-gray-600 mb-6">Добавьте фотографии или видео в эту галерею</p>
                    <button @click="showUploadModal = true"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                        Добавить файлы
                    </button>
                </div>
            </div>

            <!-- List View -->
            <div v-else>
                <!-- Header -->
                <div class="flex items-center justify-between mb-8" data-aos="fade-up">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900 mb-2">Галерея</h1>
                        <div class="w-20 h-1 bg-blue-600 rounded-full"></div>
                    </div>
                    <button @click="showAddModal = true"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg">
                        <font-awesome-icon :icon="['fas', 'plus']" />
                        <span>Создать галерею</span>
                    </button>
                </div>

                <!-- Galleries List -->
                <div v-if="galleries.length === 0" class="text-center py-16 bg-white rounded-xl" data-aos="fade-up">
                    <font-awesome-icon :icon="['fas', 'images']" class="text-6xl text-gray-300 mb-6" />
                    <h3 class="text-xl font-medium text-gray-900 mb-2">Пока нет галерей</h3>
                    <p class="text-gray-600 mb-8">Создайте свою первую галерею для хранения фотографий и видео</p>
                    <button @click="showAddModal = true"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors">
                        Создать галерею
                    </button>
                </div>

                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <div v-for="(gallery, index) in galleries" :key="gallery.id"
                        class="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                        @click="openGalleryDetail(gallery)" data-aos="fade-up" :data-aos-delay="index * 100">
                        <!-- Files Preview -->
                        <div class="aspect-video bg-gray-100 relative overflow-hidden">
                            <div v-if="gallery.files.length > 0" class="grid grid-cols-2 h-full gap-1">
                                <div v-for="(file, index) in getFirstFourFiles(gallery.files)" :key="index"
                                    class="relative overflow-hidden">
                                    <div v-if="file.type === 'video'" class="relative w-full h-full">
                                        <video :src="file.url" class="w-full h-full object-cover" muted />
                                        <div class="absolute inset-0 flex items-center justify-center">
                                            <div class="bg-black bg-opacity-30 rounded-full p-1">
                                                <font-awesome-icon :icon="['fas', 'play']" class="text-white text-xs" />
                                            </div>
                                        </div>
                                    </div>
                                    <img v-else :src="file.url" alt=""
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                            </div>
                            <div v-else class="flex items-center justify-center h-full">
                                <font-awesome-icon :icon="['fas', 'images']" class="text-4xl text-gray-300" />
                            </div>

                            <div v-if="gallery.files.length > 4"
                                class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-lg">
                                +{{ gallery.files.length - 4 }}
                            </div>

                            <!-- Action Overlay -->
                            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div class="flex space-x-1">
                                    <button @click.stop="handleEditGallery(gallery)"
                                        class="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 p-1.5 rounded-lg transition-colors">
                                        <font-awesome-icon :icon="['fas', 'edit']" class="text-sm" />
                                    </button>
                                    <button @click.stop="handleDeleteGallery(gallery.id)"
                                        class="bg-white bg-opacity-90 hover:bg-opacity-100 text-red-500 p-1.5 rounded-lg transition-colors">
                                        <font-awesome-icon :icon="['fas', 'trash']" class="text-sm" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Gallery Info -->
                        <div class="p-4">
                            <div class="flex items-center justify-between mb-2">
                                <h3 class="font-semibold text-gray-900 truncate flex-1">{{ gallery.title }}</h3>
                                <div class="flex items-center space-x-1 text-blue-600 text-sm ml-2">
                                    <font-awesome-icon :icon="['fas', 'calendar']" class="text-xs" />
                                    <span>{{ gallery.date }}</span>
                                </div>
                            </div>

                            <p v-if="gallery.description" class="text-sm text-gray-600 mb-3 line-clamp-2">
                                {{ gallery.description }}
                            </p>

                            <div class="flex items-center text-sm text-gray-500">
                                <font-awesome-icon :icon="['fas', 'images']" class="mr-1 text-xs" />
                                <span>{{ gallery.files.length }} файлов</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add/Edit Gallery Modal -->
            <div v-if="showAddModal"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-md" data-aos="zoom-in" data-aos-duration="300">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-xl font-bold text-gray-900">
                                {{ editingGallery ? 'Редактировать галерею' : 'Создать галерею' }}
                            </h3>
                            <button @click="closeAddModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                                <font-awesome-icon :icon="['fas', 'times']" class="text-xl" />
                            </button>
                        </div>

                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Название галереи
                                </label>
                                <input v-model="galleryForm.title" type="text"
                                    class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Введите название галереи" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Дата
                                </label>
                                <input v-model="galleryForm.date" type="date"
                                    class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Описание (необязательно)
                                </label>
                                <textarea v-model="galleryForm.description"
                                    class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    rows="3" placeholder="Добавьте описание галереи" />
                            </div>
                        </div>

                        <div class="flex space-x-3 mt-8">
                            <button @click="closeAddModal"
                                class="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                                Отмена
                            </button>
                            <button @click="handleCreateGallery"
                                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors">
                                {{ editingGallery ? 'Сохранить' : 'Создать' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Upload Modal -->
            <div v-if="showUploadModal"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-md" data-aos="zoom-in" data-aos-duration="300">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-xl font-bold text-gray-900">Добавить файлы</h3>
                            <button @click="showUploadModal = false"
                                class="text-gray-400 hover:text-gray-600 transition-colors">
                                <font-awesome-icon :icon="['fas', 'times']" class="text-xl" />
                            </button>
                        </div>

                        <div class="space-y-4">
                            <label
                                class="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer block">
                                <input ref="fileInput" type="file" multiple accept="image/*,video/*"
                                    @change="handleFileUpload" class="hidden" />
                                <font-awesome-icon :icon="['fas', 'cloud-upload-alt']"
                                    class="text-4xl text-gray-400 mb-3" />
                                <p class="text-gray-600 mb-1">Нажмите для выбора файлов</p>
                                <p class="text-sm text-gray-500">Поддерживаются изображения и видео</p>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const galleries = ref([])
const currentView = ref('list')
const selectedGallery = ref(null)
const showAddModal = ref(false)
const showUploadModal = ref(false)
const editingGallery = ref(null)
const fileInput = ref(null)

const galleryForm = reactive({
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
})

onMounted(() => {
    const sampleGalleries = [
        {
            id: 1,
            title: "Корпоративный тренинг",
            date: "15.03.2024",
            description: "Фотографии с корпоративного тренинга команды",
            files: [
                { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400', name: 'training1.jpg' },
                { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400', name: 'training2.jpg' },
                { id: 3, type: 'image', url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400', name: 'training3.jpg' },
                { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400', name: 'training4.jpg' },
                { id: 5, type: 'image', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400', name: 'training5.jpg' }
            ]
        },
        {
            id: 2,
            title: "Офисные мероприятия",
            date: "10.03.2024",
            description: "Различные офисные события и празднования",
            files: [
                { id: 6, type: 'image', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400', name: 'office1.jpg' },
                { id: 7, type: 'image', url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400', name: 'office2.jpg' },
                { id: 8, type: 'image', url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400', name: 'office3.jpg' }
            ]
        }
    ]
    galleries.value = sampleGalleries
})

const resetForm = () => {
    galleryForm.title = ''
    galleryForm.date = new Date().toISOString().split('T')[0]
    galleryForm.description = ''
    editingGallery.value = null
}

const closeAddModal = () => {
    showAddModal.value = false
    resetForm()
}

const handleCreateGallery = () => {
    if (!galleryForm.title.trim()) {
        alert('Введите название галереи')
        return
    }

    if (editingGallery.value) {
        const index = galleries.value.findIndex(g => g.id === editingGallery.value.id)
        if (index !== -1) {
            galleries.value[index] = {
                ...galleries.value[index],
                ...galleryForm
            }
        }
    } else {
        const newGallery = {
            id: Date.now(),
            ...galleryForm,
            files: []
        }
        galleries.value.unshift(newGallery)
    }

    closeAddModal()
}

const handleDeleteGallery = (galleryId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту галерею?')) {
        galleries.value = galleries.value.filter(g => g.id !== galleryId)
    }
}

const handleEditGallery = (gallery) => {
    editingGallery.value = gallery
    galleryForm.title = gallery.title
    galleryForm.date = gallery.date
    galleryForm.description = gallery.description || ''
    showAddModal.value = true
}

const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)

    files.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const newFile = {
                id: Date.now() + Math.random(),
                type: file.type.startsWith('video/') ? 'video' : 'image',
                url: e.target.result,
                name: file.name
            }

            selectedGallery.value.files.push(newFile)
        }
        reader.readAsDataURL(file)
    })

    showUploadModal.value = false
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const handleDeleteFile = (fileId) => {
    if (window.confirm('Удалить этот файл?')) {
        selectedGallery.value.files = selectedGallery.value.files.filter(f => f.id !== fileId)

        const galleryIndex = galleries.value.findIndex(g => g.id === selectedGallery.value.id)
        if (galleryIndex !== -1) {
            galleries.value[galleryIndex].files = selectedGallery.value.files
        }
    }
}

const openGalleryDetail = (gallery) => {
    selectedGallery.value = gallery
    currentView.value = 'detail'
    setTimeout(() => {
        if (window.AOS) window.AOS.refresh()
    }, 100)
}

const getFirstFourFiles = (files) => {
    return files?.slice(0, 4) || []
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    --webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>