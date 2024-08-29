document.addEventListener('DOMContentLoaded', () => {
  // 수치 설정
  const PHASE_DEPTH=4;
  const EFFECT_REMINING_TIME = 6500;

  // 초기 설정
  const images = document.querySelectorAll('.item img'); //음성인식에 성공했을때 바꿀이미지
  const diagnostic = document.querySelector('.output');
  const hints = document.querySelector('.hints');
  const imageElement = document.getElementById('emotion-image');
  const imageOverlay= document.getElementById('overlay-image');
  const imageOverlay2= document.getElementById('overlay-image2');
  const speechButton = document.getElementById('speech-button');
  const inits = document.querySelectorAll('.init');
  const un_inits = document.querySelectorAll('.un_init');
  const back = document.getElementById('back');

  const baseUrl = window.location.origin;
  const repositoryName = "/Running_Girls";
  //초기화 함수 //
  //==============================================//
  function initialize() {
    // 초기 상태 설정
    inits.forEach(init => {
      init.classList.add('un_init');
      init.classList.remove('init');
    });
    un_inits.forEach(un_init => {
      un_init.classList.remove('un_init');
    });

    // 경로 설정
    const imageUrl = baseUrl.includes('github.io')
      ? `${baseUrl}${repositoryName}/img/background_img/background_image_phase_01.jpeg`
      : "../img/background_img/background_image_phase_01.jpeg";

    // 배경 이미지와 투명도 설정
    back.style.backgroundImage = `url('${imageUrl}')`;
    back.style.transition = "opacity 1s ease";  // 트랜지션 설정
    back.style.opacity = 0.8;
    document.getElementById('ground').style.display = 'block';

    // 클릭 이벤트 리스너 제거
    speechButton.removeEventListener('click', initialize);
    recognition.stop();
    speechButton.classList.remove('active');

    const preloadImages = (images) => {
      images.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    };
    
    const isGitHubPages = baseUrl.includes('github.io');
    const imageBasePath = isGitHubPages ? `${baseUrl}${repositoryName}/img/emotion/` : "../img/emotion/";
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
    const imageBasePath2 = isGitHubPages ? `${baseUrl}${repositoryName}/img/background_img/` : "../img/background_img/";
    const imagePaths2 = [
      `${imageBasePath2}background_image_phase_01.jpeg`
      `${imageBasePath2}background_image_phase_02.jpeg`
      `${imageBasePath2}background_image_phase_03.jpeg`
      `${imageBasePath2}background_image_phase_04.jpeg`
      `${imageBasePath2}background_image_phase_05.jpeg`
    ];
    // 사전 로드 호출
    preloadImages(imagePaths);
    preloadImages(imagePaths2);
  }
  //==============================================//
  // 클릭 이벤트 리스너 추가
  speechButton.addEventListener('click', initialize);

  // 배경 설정//
  //==============================================//
  let currentPhase = 1;
  function showNextBackground() {
    // 배경 이미지 페이드 아웃
    back.style.opacity = 0;
    
    // 배경 이미지 전환과 오버레이 이미지 업데이트
    setTimeout(() => {
      currentPhase++;
      const baseUrl = window.location.origin;
      const repositoryName = "/Running_Girls";
      const imageUrlPart = baseUrl.includes('github.io')
        ? `${baseUrl}${repositoryName}/img/background_img/background_image_phase_0`
        : "../img/background_img/background_image_phase_0";
  
      // 현재 Phase를 설정하고 배경 이미지 업데이트
      back.style.backgroundImage = "url('" + imageUrlPart + currentPhase + ".jpeg')";
      
      // Phase가 5일 때 오버레이 이미지 표시
      if (currentPhase === 5) {
        imageOverlay2.src = '../img/나비_투명.GIF'; // 오버레이 이미지 설정
        imageOverlay2.style.display = 'block'; // 오버레이 이미지 표시
      } else {
        imageOverlay2.style.display = 'none'; // 오버레이 이미지 숨기기
      }
  
      // 새로운 배경 이미지가 적용된 후 페이드 인
      back.style.opacity = 0.7;
    },1000);
  }
  //==============================================//
  let currentIndex = 0;
  function showNextImage() {
    // 현재 이미지를 숨깁니다.
    images[currentIndex].classList.remove('active');
    images[currentIndex].classList.add('hidden');
    // 다음 이미지를 표시합니다.
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].classList.remove('hidden');
    images[currentIndex].classList.add('active');
  }

  // 음성 인식 설정
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;
  //var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

  var emotions = ['happy', 'sad', 'angry', 'mad', 'excited', 'bored', 'nervous', 'surprised', 'calm'];
  
  var recognition = new SpeechRecognition();
  if (SpeechGrammarList) {
    var speechRecognitionList = new SpeechGrammarList();
    var grammar = '#JSGF V1.0; grammar emotions; public <emotion> = ' + emotions.join(' | ') + ' ;';
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
  }

  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;


  // 감정에 따라 상호작용 구현
  var happy_count=0;
  var sad_count=0;
  var mad_count =0;
  var cheer_count =0;

  const isGitHubPages = baseUrl.includes('github.io');
  const imageBasePath = isGitHubPages ? `${baseUrl}${repositoryName}/img/emotion/` : "../img/emotion/";
  const changeImage = (emotion) => {
    let originalSrc = 'img/!!런닝걸즈기본투명.GIF'; // 기본 이미지 경로
    let newSrc = ''; // 변경할 이미지 경로
    //감정 모아주는 로직 구현

    //==================//
    const getEmotionImagePath = (count, emotion) => {
      let imagePath='';
      if(emotion.toLowerCase() === 'mad'){
         imagePath = `${emotion}_0${(count % 2) + 1}.GIF`;
      }
      else{
        imagePath = `${emotion}_0${(count % 3) + 1}.GIF`;
      }
      return imageBasePath + imagePath;
    }

    switch (emotion.toLowerCase()) {
      case 'happy':
        if(happy_count%3==0){
          newSrc= getEmotionImagePath(happy_count,'happy');
        setTimeout(() => {
          imageElement.src = newSrc;
        }, 500);
        setTimeout(() => {
          imageElement.src = originalSrc;
      }, EFFECT_REMINING_TIME);
        }
        else if(happy_count%3==1){
          newSrc = getEmotionImagePath(happy_count, 'happy');
        setTimeout(() => {
          imageElement.src = newSrc;
        }, 500);
        setTimeout(() => {
          imageElement.src = originalSrc; 
        }, 3500);
        }
        else{
          newSrc = getEmotionImagePath(happy_count, 'happy');
          setTimeout(() => {
            imageOverlay.src = newSrc
            imageOverlay.style.display= 'block';
          }, 500);
          setTimeout(() => {
            imageOverlay.style.display= 'none';
          }, EFFECT_REMINING_TIME);
        }
        happy_count++;
        break;
      case 'sad':
        if(sad_count%3==0){
          newSrc = getEmotionImagePath(sad_count, 'sad');
        setTimeout(() => {
          imageElement.src = newSrc;
        }, 500);
        setTimeout(() => {
          imageElement.src = originalSrc;
      }, EFFECT_REMINING_TIME);
        }
        else if(sad_count%3==1){
          newSrc = getEmotionImagePath(sad_count, 'sad');
        setTimeout(() => {
          imageElement.src = newSrc;
        }, 500);
        setTimeout(() => {
          imageElement.src = originalSrc; 
      }, 7500);
        }
        else{
          newSrc=getEmotionImagePath(sad_count, 'sad');
        setTimeout(() => {
          imageOverlay.src = newSrc;
          imageOverlay.style.display= 'block';
        }, 500);
        setTimeout(() => {
          imageOverlay.style.display= 'none';
      }, EFFECT_REMINING_TIME);
        }
        sad_count++;
        break;
      case 'mad':
        if(mad_count%2==0){
          newSrc = getEmotionImagePath(mad_count, 'mad');
        setTimeout(() => {
          imageElement.src = newSrc;
        }, 500);
        setTimeout(() => {
          imageElement.src = originalSrc; 
      }, EFFECT_REMINING_TIME);
        }
        else{
          newSrc= getEmotionImagePath(mad_count, 'mad');
        setTimeout(() => {
          imageOverlay.src = newSrc;
          imageOverlay.style.display= 'block';
        }, 500);
        setTimeout(() => {
          imageOverlay.style.display= 'none';
        }, EFFECT_REMINING_TIME);
        newSrc = '../img/emotion/mad_01.GIF';
        }
        mad_count++;
        break;
      case 'cheer':
        newSrc = getEmotionImagePath(cheer_count, 'cheer');
        setTimeout(() => {
          imageElement.src = newSrc;
        }, 500);
        setTimeout(() => {
          imageElement.src = originalSrc;
      }, EFFECT_REMINING_TIME);
        break;
      default:
        newSrc = originalSrc;
    }
  }

  // 사용자가 버튼 클릭 시 음성 인식 시작
  speechButton.addEventListener('click', startRecognition);
  speechButton.addEventListener('touchstart', startRecognition);
  function startRecognition() {
      speechButton.classList.add('active');
      recognition.start();
      diagnostic.textContent = 'Listening for an emotion...';
      hints.textContent = '';
      console.log('Ready to receive an emotion.');
  }

  // 음성 인식 결과 처리
  var count = 0;
  recognition.onresult = function(event) {
    var emotion = event.results[0][0].transcript;
    count++;
    if(count%PHASE_DEPTH ==0){
      showNextBackground();
    }
    changeImage(emotion);
    diagnostic.textContent = 'Emotion recognized: ' + emotion + '.';
    
    
    // 감정에 따라 이미지 변경
    //showNextImage();
    


    // 감정 상태에 따른 힌트 표시
    switch (emotion.toLowerCase()) {
      case 'happy':
        hints.textContent = 'It seems you are happy!';
        break;
      case 'sad':
        hints.textContent = 'It seems you are sad.';
        break;
      case 'angry':
        hints.textContent = 'It seems you are angry!';
        break;
      case 'excited':
        hints.textContent = 'It seems you are excited!';
        break;
      case 'bored':
        hints.textContent = 'It seems you are bored.';
        break;
      case 'nervous':
        hints.textContent = 'It seems you are nervous.';
        break;
      case 'surprised':
        hints.textContent = 'It seems you are surprised!';
        break;
      case 'calm':
        hints.textContent = 'It seems you are calm.';
        break;
      default:
        hints.textContent = 'Emotion not recognized.';
    }
    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  // 음성 인식이 끝났을 때
  recognition.onspeechend = function() {
    recognition.stop();
    speechButton.classList.remove('active');
  }

  // 음성 인식이 감정을 인식하지 못했을 때
  recognition.onnomatch = function(event) {
    diagnostic.textContent = "I didn't recognise that emotion.";
    speechButton.classList.remove('active');
  }

  // 음성 인식 오류 발생 시
  recognition.onerror = function(event) {
    diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
    speechButton.classList.remove('active');
  }
});




//===============================================//


//nextButton.addEventListener('click', showNextImage);



/*
//SpeechRecognition: 음성 인식을 처리하는 객체입니다. 브라우저에 따라 webkitSpeechRecognition을 사용해야 할 수도 있습니다.
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
//SpeechGrammarList: 음성 인식의 문법을 정의하는 객체입니다. Safari에서는 사용되지 않을 수 있습니다.
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
//SpeechRecognitionEvent: 음성 인식 이벤트의 객체입니다. 브라우저 호환성을 위해 webkitSpeechRecognitionEvent을 사용합니다.
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent


var emotions = [ 'happy', 'sad', 'angry', 'excited', 'bored', 'nervous', 'surprised', 'calm' ];



var recognition = new SpeechRecognition(); //recognition 객체를 생성하여 음성 인식을 초기화합니다.
if (SpeechGrammarList) {
  // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
  // This code is provided as a demonstration of possible capability. You may choose not to use it.
  var speechRecognitionList = new SpeechGrammarList();
  var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
}

if (SpeechGrammarList) {
  var speechRecognitionList = new SpeechGrammarList();
  var grammar = '#JSGF V1.0; grammar emotions; public <emotion> = ' + emotions.join(' | ') + ' ;';
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
}


recognition.continuous = false; //continuous: false로 설정하면 사용자가 음성을 중지할 때까지 음성을 인식합니다.
recognition.lang = 'en-US'; //lang: 음성 인식에 사용할 언어를 설정합니다. 여기서는 영어(en-US)를 사용합니다. -> Ko 로 바꿀 수 있는지 알아보기.
recognition.interimResults = false; //interimResults: 중간 결과를 표시하지 않도록 설정합니다.
recognition.maxAlternatives = 1; //maxAlternatives: 음성 인식 결과의 최대 대안을 설정합니다.

var diagnostic = document.querySelector('.output'); //diagnostic: 음성 인식 결과를 표시할 요소를 선택합니다. 
var bg = document.querySelector('html'); //bg: 배경 색상을 변경할 HTML 요소를 선택합니다.
var hints = document.querySelector('.hints'); //hints: 힌트를 표시할 요소를 선택하지만 코드에서는 사용되지 않습니다.

var colorHTML= '';
colors.forEach(function(v, i, a){
  console.log(v, i);
  colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
});
hints.innerHTML = 'Tap/click then say a color to change the background color of the app. Try ' + colorHTML + '.';

//사용자가 페이지를 클릭하면 음성 인식이 시작됩니다. 이때 'Ready to receive a color command.'라는 메시지가 콘솔에 출력됩니다.
document.body.onclick = function() {
  recognition.start();
  console.log('Ready to receive a color command.');
}


//음성 인식이 완료되면 onresult 이벤트가 발생합니다.
recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object


  var emotion = event.results[0][0].transcript; //event.results[0][0].transcript에서 인식된 색상 값을 가져옵니다.
  diagnostic.textContent = 'Emotion recognized: ' + emotion + '.';

  // 감정에 따라 상호작용 구현
  //bg.style.backgroundColor = color; //diagnostic 요소에 결과를 표시하고, bg 요소의 배경 색상을 인식된 색상으로 변경합니다. << 이게 대체된 구간
  switch (emotion.toLowerCase()) {
    case 'happy':
      bg.style.backgroundColor = 'yellow';
      hints.textContent = 'It seems you are happy!';
      break;
    case 'sad':
      bg.style.backgroundColor = 'blue';
      hints.textContent = 'It seems you are sad.';
      break;
    case 'angry':
      bg.style.backgroundColor = 'red';
      hints.textContent = 'It seems you are angry!';
      break;
    // 다른 감정 상태에 대한 처리 추가
    default:
      bg.style.backgroundColor = 'gray';
      hints.textContent = 'Emotion not recognized.';
  }
  
  console.log('Confidence: ' + event.results[0][0].confidence); //인식의 신뢰도를 콘솔에 출력합니다.
}

//onspeechend: 사용자가 말을 끝내면 음성 인식을 중지합니다.
recognition.onspeechend = function() {
  recognition.stop();
}

//onnomatch: 음성 인식이 색상을 인식하지 못할 때 메시지를 표시합니다.
recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that color.";
}

//onerror: 음성 인식 중 오류가 발생하면 오류 메시지를 표시합니다.
recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}
  */