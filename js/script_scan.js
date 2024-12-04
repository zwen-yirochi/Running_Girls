document.addEventListener('DOMContentLoaded', () => {
  // 수치 설정
  const PHASE_DEPTH = 4;
  const EFFECT_REMINING_TIME = 6500;

  // 초기 설정
  const speechButton = document.getElementById('speech-button');
  const inits = document.querySelectorAll('.init');
  const un_inits = document.querySelectorAll('.un_init');

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
  }
  //==============================================//
  // 클릭 이벤트 리스너 추가
  speechButton.addEventListener('click', initialize);

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
  var happy_count = 0;
  var sad_count = 0;
  var mad_count = 0;
  var cheer_count = 0;

  const isGitHubPages = baseUrl.includes('github.io');
  const imageBasePath = isGitHubPages ? `${baseUrl}${repositoryName}/img/emotion/` : "../img/emotion/";
  const changeImage = (emotion) => {
    let originalSrc = 'img/!!런닝걸즈기본투명.GIF'; // 기본 이미지 경로
    let newSrc = ''; // 변경할 이미지 경로

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
  }
  const sliderTrack = document.querySelector('.slider-track');
  const slides = document.querySelectorAll('.slide');
  const prevButton = document.querySelector('.prev-button');
  const nextButton = document.querySelector('.next-button');
  const dotsContainer = document.querySelector('.dots-container');


  // 현재 슬라이드 인덱스
  let currentIndex = 0;

  // 슬라이드 너비 계산
  let slideWidth = slides[0].offsetWidth + 10; // 슬라이드 + 여백

  // 점 네비게이션 생성
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dotsContainer.appendChild(dot);

    // 점 클릭 시 슬라이드 이동
    dot.addEventListener('click', () => {
      moveToSlide(index);
    });
  });

  // 점 상태 업데이트
  function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  // 슬라이드를 이동하는 함수
  function moveToSlide(index) {
    currentIndex = index;
    sliderTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    updateDots();
  }

  // 스크롤 이벤트를 통한 동작
  let isScrolling = false;

  sliderTrack.addEventListener('scroll', () => {
    if (!isScrolling) {
      isScrolling = true;

      // 현재 스크롤 위치 계산
      const scrollLeft = sliderTrack.scrollLeft;
      const newIndex = Math.round(scrollLeft / slideWidth); // 가장 가까운 슬라이드 인덱스

      if (newIndex !== currentIndex) {
        currentIndex = newIndex;
        updateDots();
      }

      // 스크롤 스냅 효과
      setTimeout(() => {
        sliderTrack.scrollTo({
          left: currentIndex * slideWidth,
          behavior: 'smooth',
        });
        isScrolling = false;
      }, 100);
    }
  });

  // 터치 스크롤로 슬라이드 전환
  let startX = 0;

  sliderTrack.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  sliderTrack.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50 && currentIndex < slides.length - 1) {
      moveToSlide(currentIndex + 1); // 다음 슬라이드
    } else if (endX - startX > 50 && currentIndex > 0) {
      moveToSlide(currentIndex - 1); // 이전 슬라이드
    }
  });

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      moveToSlide(currentIndex - 1);
    }
  });

  // 다음 슬라이드로 이동
  nextButton.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
      moveToSlide(currentIndex + 1);
    }
  });

  // 창 크기 변경 시 슬라이드 너비 재계산
  window.addEventListener('resize', () => {
    slideWidth = slides[0].offsetWidth + 10;
    moveToSlide(currentIndex);
  });



  //-==============
  if (!window.socket) { // 중복 방지
    window.socket = io('/client'); // io()는 Socket.io 클라이언트를 사용할 때 필요
  }
  const socket = window.socket;
  console.log("서버 연결 완료 - scan");

  // 서버와 WebSocket 연결

  // DOM 요소 참조
  const inputField = document.getElementById('input-field');
  const sendButton = document.getElementById('sendButton');

  let isComposing = false; // 한글 조합 상태 플래그

  // 한글 조합 상태 처리
  inputField.addEventListener('compositionstart', () => {
    isComposing = true; // 조합 시작
  });

  inputField.addEventListener('compositionend', () => {
    isComposing = false; // 조합 종료
  });

  function sendMessage() {
    const message = inputField.value.trim(); // 입력된 텍스트 가져오기 (공백 제거)

    if (message) {
      socket.emit('client message', message); // 서버로 메시지 전송
      console.log(message); // 콘솔 로그 출력
      inputField.value = ''; // 텍스트 입력창 비우기
    }
  }

  // 버튼 클릭 이벤트
  sendButton.addEventListener('click', sendMessage);

  // Enter 키로 메시지 전송 지원
  inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !isComposing) {
      event.preventDefault(); // 기본 Enter 동작 방지 (예: 폼 제출)
      sendMessage(); // 메시지 전송 함수 호출
    }
  });



  // 음성 인식 결과 처리
  var count = 0;
  recognition.onresult = function (event) {
    var emotion = event.results[0][0].transcript;
    count++;
    if (count % PHASE_DEPTH == 0) {
      showNextBackground();
    }
    changeImage(emotion);
    diagnostic.textContent = 'Emotion recognized: ' + emotion + '.';

    // 음성 인식이 끝났을 때
    recognition.onspeechend = function () {
      recognition.stop();
      speechButton.classList.remove('active');
    }

    // 음성 인식이 감정을 인식하지 못했을 때
    recognition.onnomatch = function (event) {
      diagnostic.textContent = "I didn't recognise that emotion.";
      speechButton.classList.remove('active');
    }

    // 음성 인식 오류 발생 시
    recognition.onerror = function (event) {
      diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
      speechButton.classList.remove('active');
    }
  }
});

