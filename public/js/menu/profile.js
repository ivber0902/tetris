let button = document.querySelector('.back');
let userImageInput = document.getElementById('image-input');
let userImageProfile = document.querySelector('.user-avatar')
let form = document.querySelector('form');
let testButton = document.querySelector('.button');
const slider = document.querySelector('.slider');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');
const slides = Array.from(slider.querySelectorAll('.achievement'));
const slideCount = slides.length;
const arrayAchievementBlocks = document.querySelectorAll('.achievement');
let slideIndex = 0;
let closeBlock = document.createElement('div');
closeBlock.classList.add('overlay');
let id = document.querySelector('.player-id').value
const parseAchievement = [
  {
    'min': 10,
    'mid': 50,
    'max': 100
  },
  {
    'min': 10000,
    'mid': 50000,
    'max': 100000
  },
  {
    'min': 4000,
    'mid': 8000,
    'max': 12000
  },
  {
    'min': 8,
    'mid': 5,
    'max': 3
  },
  {
    'min': 100,
    'mid': 500,
    'max': 1000
  },
  {
    'min': 100,
    'mid': 500,
    'max': 1000
  },
  {
    'min': 3,
    'mid': 5,
    'max': 10
  },
]

function ViewAchievement(){
  for(let i = 0; i < arrayAchievement.length; i++){
    let achievement = arrayAchievementBlocks[i];
    let settings = parseAchievement[i];
    if(arrayAchievement[i] < settings['min'])
      closeAchievement(achievement, 3)
    else
      if(arrayAchievement[i] < settings['mid'])
        closeAchievement(achievement, 2)
      else
        if(arrayAchievement[i] < settings['max'])
          closeAchievement(achievement, 1)
  }
}




function closeAchievement(achievement, countClouse){
  let achievementItems = achievement.querySelectorAll('.achievement__item');
  for(let i = 0; i < countClouse; i++){
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    achievementItems[2 - i].appendChild(overlay)
  }
}
button.addEventListener('click', () => {
  window.history.back();
})

userImageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
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

let arrayAchievement = [25, 75000, 7000, 4, 250, 4, 7];

updateSlider();
UpdateAchievement()

async function UpdateAchievement(){
  await fetch('/api/player/' + id, {
    method: 'GET'
  })
  .then(response => {
    return response.json();
  })
  .then(data => {
    let responseAchievement = data.statistics;
    console.log(responseAchievement);
    arrayAchievement[0] = responseAchievement.game_count;
    arrayAchievement[1] = responseAchievement.max_score;
    arrayAchievement[5] = responseAchievement.win_count;
    ViewAchievement()
  })
}


async function foundAchievment(sortKey, count, mode)
{
    let response = await fetch(`/api/game/rating?sortKey=${sortKey}&count=${count}&mode=${mode}`, {
        method: 'GET'
    });
    return await response.json();
}