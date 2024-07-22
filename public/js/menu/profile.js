let button = document.querySelector('.back');
let userImageInput = document.getElementById('image-input');
let userImageProfile = document.querySelector('.user-avatar')

// button.addEventListener('click', ()=>{
//     window.history.back();
// })

userImageInput.addEventListener('change', (event)=>{
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector('.user-avatar').src = e.target.result;
        };
        reader.readAsDataURL(file);
        ChangeImage(file)
        console.log(file)
    }
})

async function ChangeImage(image) {
    let response = await fetch('/send/image', {
        method: 'POST',
        body: image
    });
    console.log(response)
}

// Получаем элементы слайдера
const slider = document.querySelector('.slider');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');
const slides = Array.from(slider.querySelectorAll('.achievement'));
const slideCount = slides.length;
let slideIndex = 0;

// Устанавливаем обработчики событий для кнопок
prevButton.addEventListener('click', showPreviousSlide);
nextButton.addEventListener('click', showNextSlide);

// Функция для показа предыдущего слайда
function showPreviousSlide() {
  slideIndex = (slideIndex - 1 + slideCount) % slideCount;
  updateSlider();
}

// Функция для показа следующего слайда
function showNextSlide() {
  slideIndex = (slideIndex + 1) % slideCount;
  updateSlider();
}

// Функция для обновления отображения слайдера
function updateSlider() {
  slides.forEach((slide, index) => {
    if (index === slideIndex) {
      slide.style.display = 'block';
    } else {
      slide.style.display = 'none';
    }
  });
}

// Инициализация слайдера
updateSlider();