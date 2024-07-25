let button = document.querySelector('.back');
let userImageInput = document.getElementById('image-input');
let userImageProfile = document.querySelector('.user-avatar')
let form = document.querySelector('form');
const slider = document.querySelector('.slider');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');
const slides = Array.from(slider.querySelectorAll('.achievement'));
const slideCount = slides.length;
const arrayAchievementBlocks = document.querySelectorAll('.achievement');
let slideIndex = 0;
let closeBlock = document.createElement('div');
closeBlock.classList.add('overlay');
let id = document.querySelector('.player-id').value;
let arrayAchievement = [];
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
    'min': 480000,
    'mid': 300000,
    'max': 180000
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

function ViewAchievement(arrayAchievement){
  console.log(arrayAchievement)
  for(let i = 0; i < arrayAchievement.length; i++){
    let achievement = arrayAchievementBlocks[i];
    let settings = parseAchievement[i];
    if(i !== 3){
      if(arrayAchievement[i] < settings['min'])
        closeAchievement(achievement, 3)
      else
        if(arrayAchievement[i] < settings['mid'])
          closeAchievement(achievement, 2)
        else
          if(arrayAchievement[i] < settings['max'])
            closeAchievement(achievement, 1)
    }else{
      if(arrayAchievement[i] > settings['min'])
        closeAchievement(achievement, 3)
      else
        if(arrayAchievement[i] > settings['mid'])
          closeAchievement(achievement, 2)
        else
          if(arrayAchievement[i] > settings['max'])
            closeAchievement(achievement, 1)
    }
    
  }
}




function closeAchievement(achievement, countClouse){
  let achievementItems = achievement.querySelectorAll('.achievement__item');
  for(let i = 0; i < countClouse; i++){
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    achievementItems[2 - i].appendChild(overlay);
    achievementItems[2 - i].querySelector('.item__title').style.color = "#C0C0C0"
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

async function UpdateAchievement(){
  await fetch('/api/player/' + id, {
    method: 'GET'
  })
  .then(response => {
    return response.json();
  })
  .then(data => {
    let responseAchievement = data.statistics;
    arrayAchievement[0] = responseAchievement.game_count;
    arrayAchievement[1] = responseAchievement.max_score;
    arrayAchievement[5] = responseAchievement.win_count;
    foundAchievment('score', 1, 1).then((results)=>{
      if (results.length !== 0)
        arrayAchievement[2] = results[0].score
      else
        arrayAchievement[2] = 0
      foundAchievment('time', 1, 2).then((results)=>{
        console.log(results)
        if (results.length !== 0)
          arrayAchievement[3] = results[0].time
        else
          arrayAchievement[3] = 0
        foundAchievment('score', 1, 4).then((results)=>{
          if (results.length !== 0)
            arrayAchievement[4] = results[0].filled_rows
          else
            arrayAchievement[4] = 0
          fetch('/api/game/count?mode=3&isWon=true' + id, {
            method: 'GET'
          }).then(response => {
            return response.json();
          }).then(data =>{
            if (data.length !== 0)
              arrayAchievement[6] = data.count;
            else
            arrayAchievement[6] = 0;
            ViewAchievement(arrayAchievement)
          })
        });
      });
      
    })
  })
}

async function foundAchievment(sortKey, count, mode)
{
    let response = await fetch(`/api/game/rating?sortKey=${sortKey}&count=${count}&mode=${mode}&playerId=${id}`, {
        method: 'GET'
    });
    return await response.json();
}

updateSlider();
UpdateAchievement()