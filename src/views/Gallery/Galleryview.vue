<template>
    <div class="bg-gray-50">
        <div class="max-w-7xl mx-auto">
            <div v-if="currentView === 'detail' && selectedGallery">
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
                </div>

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

                <div v-if="selectedGallery.files.length > 0"
                    class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div v-for="(file, index) in selectedGallery.files" :key="file.id"
                        class="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                        @click="openImageModal(file)" data-aos="zoom-in" :data-aos-delay="index * 50">
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

                        <div
                            class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div class="bg-white bg-opacity-90 text-gray-700 p-2 rounded-full">
                                <font-awesome-icon :icon="['fas', 'eye']" class="text-lg" />
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="text-center py-16 bg-white rounded-xl" data-aos="fade-up">
                    <font-awesome-icon :icon="['fas', 'images']" class="text-6xl text-gray-300 mb-4" />
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Файлов пока нет</h3>
                    <p class="text-gray-600">В этой галерее пока нет изображений или видео</p>
                </div>
            </div>

            <div v-else>
                <div v-if="galleries.length === 0" class="text-center py-16" data-aos="fade-up">
                    <font-awesome-icon :icon="['fas', 'images']" class="text-6xl text-gray-300 mb-6" />
                    <h3 class="text-xl font-medium text-gray-900 mb-2">Галереи пока недоступны</h3>
                    <p class="text-gray-600">В данный момент галереи находятся в разработке</p>
                </div>

                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="(gallery, index) in galleries" :key="gallery.id"
                        class="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                        @click="openGalleryDetail(gallery)" data-aos="fade-up" :data-aos-delay="index * 100">
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

                            <div
                                class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div class="bg-white bg-opacity-90 text-gray-700 p-3 rounded-full">
                                    <font-awesome-icon :icon="['fas', 'eye']" class="text-xl" />
                                </div>
                            </div>
                        </div>

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

            <div v-if="showImageModal && selectedFile"
                class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
                @click="closeImageModal">
                <div class="relative max-w-5xl w-full">
                    <button @click="closeImageModal"
                        class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10">
                        <font-awesome-icon :icon="['fas', 'times']" class="text-3xl" />
                    </button>

                    <button v-if="currentFileIndex > 0" @click.stop="previousFile"
                        class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors">
                        <font-awesome-icon :icon="['fas', 'chevron-left']" class="text-3xl" />
                    </button>
                    <button v-if="currentFileIndex < selectedGallery.files.length - 1" @click.stop="nextFile"
                        class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors">
                        <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-3xl" />
                    </button>

                    <div class="flex items-center justify-center">
                        <video v-if="selectedFile.type === 'video'" :src="selectedFile.url"
                            class="max-w-full max-h-[80vh] object-contain" controls autoplay />
                        <img v-else :src="selectedFile.url" :alt="selectedFile.name"
                            class="max-w-full max-h-[80vh] object-contain" />
                    </div>

                    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
                        <p class="text-lg font-medium">{{ selectedFile.name }}</p>
                        <p class="text-sm opacity-75">{{ currentFileIndex + 1 }} из {{ selectedGallery.files.length }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const galleries = ref([])
const currentView = ref('list')
const selectedGallery = ref(null)
const showImageModal = ref(false)
const selectedFile = ref(null)
const currentFileIndex = ref(0)

onMounted(() => {
    const sampleGalleries = [
        {
            id: 1,
            title: "Корпоративный тренинг 2024",
            date: "15.03.2024",
            description: "Фотографии с корпоративного тренинга команды AlbaDent",
            files: [
                { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800', name: 'training1.jpg' },
                { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800', name: 'training2.jpg' },
                { id: 3, type: 'image', url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800', name: 'training3.jpg' },
                { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800', name: 'training4.jpg' },
                { id: 5, type: 'image', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800', name: 'training5.jpg' }
            ]
        },
        {
            id: 2,
            title: "Офисные мероприятия",
            date: "10.03.2024",
            description: "Различные офисные события и празднования",
            files: [
                { id: 6, type: 'image', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800', name: 'office1.jpg' },
                { id: 7, type: 'image', url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800', name: 'office2.jpg' },
                { id: 8, type: 'image', url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800', name: 'office3.jpg' }
            ]
        },
        {
            id: 3,
            title: "Новое оборудование",
            date: "05.03.2024",
            description: "Презентация нового стоматологического оборудования",
            files: [
                { id: 9, type: 'image', url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800', name: 'equipment1.jpg' },
                { id: 10, type: 'image', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800', name: 'equipment2.jpg' },
                { id: 11, type: 'image', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800', name: 'equipment6.jpg' },
                { id: 12, type: 'image', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800', name: 'equipment4.jpg' }
            ]
        }
    ]
    galleries.value = sampleGalleries
})

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

const openImageModal = (file) => {
    selectedFile.value = file
    currentFileIndex.value = selectedGallery.value.files.findIndex(f => f.id === file.id)
    showImageModal.value = true
    document.body.style.overflow = 'hidden'
}

const closeImageModal = () => {
    showImageModal.value = false
    selectedFile.value = null
    document.body.style.overflow = 'auto'
}

const previousFile = () => {
    if (currentFileIndex.value > 0) {
        currentFileIndex.value--
        selectedFile.value = selectedGallery.value.files[currentFileIndex.value]
    }
}

const nextFile = () => {
    if (currentFileIndex.value < selectedGallery.value.files.length - 1) {
        currentFileIndex.value++
        selectedFile.value = selectedGallery.value.files[currentFileIndex.value]
    }
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