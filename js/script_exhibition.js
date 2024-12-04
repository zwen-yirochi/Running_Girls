const progressBar = document.getElementById('progress-bar');
const imageElement = document.getElementById('emotion-image');
const imageOverlay = document.getElementById('overlay-image');
const imageOverlay2 = document.getElementById('overlay-image2');
const imageOverlay3 = document.getElementById('overlay-image3');
document.addEventListener('DOMContentLoaded', () => {

  // 초기 설정
  const test_button = document.getElementById('test_button');
  const qr_image = document.getElementById('qr_image');
  const triangle = document.getElementById('triangle');
  const mini = document.getElementById('mini');
  const ground = document.getElementById('ground');
  const title = document.getElementById('title');

  const back = document.getElementById('back');

  const baseUrl = window.location.origin;
  const repositoryName = "/Running_Girls";

  // 배경 이미지와 투명도 설정
  const imageUrl = baseUrl.includes('github.io')
    ? `${baseUrl}${repositoryName}/img/background_img/background_image_phase_01.jpeg`
    : "../img/background_img/background_image_phase_01.jpeg";

  back.style.backgroundImage = `url('${imageUrl}')`;
  back.style.transition = "opacity 1s ease";  // 트랜지션 설정
  back.style.opacity = 0.7;

  const preloadImages = (images) => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  };
  // 사전 로드 호출
  var isGitHubPages = baseUrl.includes('github.io');
  var imageBasePath = isGitHubPages ? `${baseUrl}${repositoryName}/img/emotion/` : "../img/emotion/";
  const imagePaths = [
    `${imageBasePath}happy_01.GIF`,
    `${imageBasePath}happy_02.GIF`,
    `${imageBasePath}happy_03.GIF`,
    `${imageBasePath}sad_01.GIF`,
    `${imageBasePath}sad_02.GIF`,
    `${imageBasePath}sad_03.GIF`,
    `${imageBasePath}mad_01.GIF`,
    `${imageBasePath}mad_02.GIF`,
    `${imageBasePath}cheer_01.GIF`
  ];

  preloadImages(imagePaths);
});
let currentPhase = 1;
function showNextBackground() {
  back.style.opacity = 0;

  setTimeout(() => {
    currentPhase++;
    const baseUrl = window.location.origin;
    const repositoryName = "/Running_Girls";
    const imageUrlPart = baseUrl.includes('github.io')
      ? `${baseUrl}${repositoryName}/img/background_img/background_image_phase_0`
      : "../img/background_img/background_image_phase_0";

    // 현재 Phase를 설정하고 배경 이미지 업데이트
    back.style.backgroundImage = "url('" + imageUrlPart + currentPhase + ".jpeg')";


    if (currentPhase === 4) {
      title.classList.add('inverted');
      ground.classList.add('inverted');
      qr_image.classList.add('inverted');
      progressBar.classList.add('inverted');
      triangle.classList.add('inverted');
    } else {
      title.classList.remove('inverted');
      qr_image.classList.remove('inverted');
      ground.classList.remove('inverted');
      progressBar.classList.remove('inverted');
      triangle.classList.remove('inverted');
    }
    // 새로운 배경 이미지가 적용된 후 페이드 인
    back.style.opacity = 0.7;


    // Phase가 5일 때 오버레이 이미지 표시
    if (currentPhase === 5) {
      imageOverlay2.src = '../img/나비_투명.GIF'; // 오버레이 이미지 설정
      imageOverlay2.style.display = 'block';
      imageOverlay3.style.display = 'none';
      currentPhase = 0;
    } else if (currentPhase === 4) {
      imageOverlay3.src = '../img/running girls bg eyes.gif'; // 오버레이 이미지 설정
      imageOverlay3.style.display = 'block';
    } else {
      imageOverlay2.style.display = 'none'; // 오버레이 이미지 숨기기
      imageOverlay3.style.display = 'none';
    }
  }, 1000);
}
// 감정에 따라 상호작용 구현
var happy_count = 0;
var sad_count = 0;
var mad_count = 0;
var cheer_count = 0;
var emotions = ['happy', 'sad', 'angry', 'mad', 'cheer'];

let lastExecutionTime = 0; // 마지막 실행 시간을 추적하는 변수
const debounceDelay = 5000;
function interact(message) {
  if (emotions.includes(message.toLowerCase())) {
    console.log("상호작용 실행");
  } else {
    return;
  }
  imageBasePath = "../img/emotion/";
  const changeImage = (emotionIn) => {
    const currentTime = Date.now();
    if (currentTime - lastExecutionTime < debounceDelay) {
      console.log('5초 이내에는 다시 실행할 수 없습니다.');
      return; // 5초 이내에 호출되면 함수 종료
    }
    let emotion = emotionIn.toLowerCase();
    let originalSrc = 'img/!!런닝걸즈기본투명.GIF'; // 기본 이미지 경로
    let newSrc = ''; // 변경할 이미지 경로
    const getEmotionImagePath = (count, emotion) => {
      let imagePath = '';
      if (emotion.toLowerCase() === 'mad') {
        imagePath = `${emotion}_0${(count % 2) + 1}.GIF`;
      }
      else {
        imagePath = `${emotion}_0${(count % 3) + 1}.GIF`;
      }
      return imageBasePath + imagePath;
    }

    switch (emotion) {
      case 'happy':
        if (happy_count % 3 == 0) {
          newSrc = getEmotionImagePath(happy_count, 'happy');
          setTimeout(() => {
            imageElement.src = newSrc;
          }, 500);
          setTimeout(() => {
            imageElement.src = originalSrc;
          }, 7500);
        }
        else if (happy_count % 3 == 1) {
          newSrc = getEmotionImagePath(happy_count, 'happy');
          setTimeout(() => {
            imageElement.src = newSrc;
          }, 500);
          setTimeout(() => {
            imageElement.src = originalSrc;
          }, 3500);
        }
        else {
          newSrc = getEmotionImagePath(happy_count, 'happy');
          setTimeout(() => {
            imageOverlay.src = newSrc
            imageOverlay.style.display = 'block';
          }, 500);
          setTimeout(() => {
            imageOverlay.style.display = 'none';
          }, 7500);
        }
        happy_count++;
        break;
      case 'sad':
        if (sad_count % 3 == 0) {
          newSrc = getEmotionImagePath(sad_count, 'sad');
          setTimeout(() => {
            imageElement.src = newSrc;
          }, 500);
          setTimeout(() => {
            imageElement.src = originalSrc;
          }, 7500);
        }
        else if (sad_count % 3 == 1) {
          newSrc = getEmotionImagePath(sad_count, 'sad');
          setTimeout(() => {
            imageElement.src = newSrc;
          }, 500);
          setTimeout(() => {
            imageElement.src = originalSrc;
          }, 7500);
        }
        else {
          newSrc = getEmotionImagePath(sad_count, 'sad');
          setTimeout(() => {
            imageOverlay.src = newSrc;
            imageOverlay.style.display = 'block';
          }, 500);
          setTimeout(() => {
            imageOverlay.style.display = 'none';
          }, 7500);
        }
        sad_count++;
        break;
      case 'mad':
        if (mad_count % 2 == 0) {
          newSrc = getEmotionImagePath(mad_count, 'mad');
          setTimeout(() => {
            imageElement.src = newSrc;
          }, 500);
          setTimeout(() => {
            imageElement.src = originalSrc;
          }, 7500);
        }
        else {
          newSrc = '../img/emotion/mad_02.GIF';
          setTimeout(() => {
            imageOverlay.src = newSrc;
            imageOverlay.style.display = 'block';
          }, 500);
          setTimeout(() => {
            imageOverlay.style.display = 'none';
          }, 7500);

        }
        mad_count++;
        break;
      case 'cheer':
        newSrc = '../img/emotion/cheer_01.GIF';
        setTimeout(() => {
          imageElement.src = newSrc;
        }, 500);
        setTimeout(() => {
          imageElement.src = originalSrc;
        }, 7500);
        break;
      default:
        newSrc = originalSrc;
    }
    lastExecutionTime = currentTime;
  }
  changeImage(message);
}
//웹소켓 관련
//===========================//
var count = 0;
const socket = io('/display'); // 서버와 연결
console.log("서버 연결 완료 - exhibition");

const display = document.getElementById('display');

socket.on('display message', (message) => {
  interact(message);
  console.log(message);
  count++;
  if (count % PHASE_DEPTH == 0) {
    showNextBackground();
  }
  updateProgressBar(count);
});

// 수치 설정
const PHASE_DEPTH = 10;

function updateProgressBar(count) {
  var progressPercentage = count % PHASE_DEPTH;
  var bar_width = ((progressPercentage * 90) / PHASE_DEPTH) + 5;
  progressBar.style.width = `${bar_width}%`;
  triangle.style.left = `${bar_width}%`;
  mini.style.left = `${bar_width - 7}%`;
}

//setInterval(test, 2000);



