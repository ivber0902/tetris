let button = document.querySelector('.back');
let userImageInput = document.getElementById('image-input');
let userImageProfile = document.querySelector('.user-avatar')
let form = document.querySelector('form');
const slider = document.querySelector('.slider');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');
const slides = Array.from(slider.querySelectorAll('.achievement'));
const slideCount = slides.length;
let slideIndex = 0;

button.addEventListener('click', ()=>{
    window.history.back();
})

userImageInput.addEventListener('change', (event)=>{
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector('.user-avatar').src = e.target.result;
        };
        reader.readAsDataURL(file);
        form.submit();
    }
})

prevButton.addEventListener('click', showPreviousSlide);
nextButton.addEventListener('click', showNextSlide);

function showPreviousSlide() {
  slideIndex = (slideIndex - 1 + slideCount) % slideCount;
  updateSlider();
}

function showNextSlide() {
  slideIndex = (slideIndex + 1) % slideCount;
  updateSlider();
}

function updateSlider() {
  slides.forEach((slide, index) => {
    if (index === slideIndex) {
      slide.style.display = 'block';
    } else {
      slide.style.display = 'none';
    }
  });
}

updateSlider();