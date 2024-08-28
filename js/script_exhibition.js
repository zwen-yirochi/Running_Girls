document.addEventListener('DOMContentLoaded', () => {
  // 수치 설정
  const PHASE_DEPTH=1;

  // 초기 설정
  const imageElement = document.getElementById('emotion-image');
  const imageOverlay= document.getElementById('overlay-image');
  const imageOverlay2= document.getElementById('overlay-image2');
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


  //배경 전환 함수
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

  // 감정에 따라 상호작용 구현
  var happy_count=0;
  var sad_count=0;
  var mad_count =0;
  var cheer_count =0;

  imageBasePath = isGitHubPages ? `${baseUrl}${repositoryName}/img/emotion/` : "../img/emotion/";
  const changeImage = (emotion) => {
    let originalSrc = 'img/!!런닝걸즈기본투명.GIF'; // 기본 이미지 경로
    let newSrc = ''; // 변경할 이미지 경로

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
      }, 3000);
        }
        else if(happy_count%3==1){
          newSrc = getEmotionImagePath(happy_count, 'happy');
        setTimeout(() => {
          imageElement.src = newSrc;
        }, 500);
        setTimeout(() => {
          imageElement.src = originalSrc; 
        }, 1000);
        }
        else{
          newSrc = getEmotionImagePath(happy_count, 'happy');
          setTimeout(() => {
            imageOverlay.src = newSrc
            imageOverlay.style.display= 'block';
          }, 500);
          setTimeout(() => {
            imageOverlay.style.display= 'none';
          }, 3000);
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
      }, 3000);
        }
        else if(sad_count%3==1){
          newSrc = getEmotionImagePath(sad_count, 'sad');
        setTimeout(() => {
          imageElement.src = newSrc;
        }, 500);
        setTimeout(() => {
          imageElement.src = originalSrc; 
      }, 3500);
        }
        else{
          newSrc=getEmotionImagePath(sad_count, 'sad');
        setTimeout(() => {
          imageOverlay.src = newSrc;
          imageOverlay.style.display= 'block';
        }, 500);
        setTimeout(() => {
          imageOverlay.style.display= 'none';
      }, 3500);
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
      }, 3500);
        }
        else{
        setTimeout(() => {
          imageOverlay.src = getEmotionImagePath(mad_count, 'mad');
          imageOverlay.style.display= 'block';
        }, 500);
        setTimeout(() => {
          imageOverlay.style.display= 'none';
        }, 3500);
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
      }, 3000);
        break;
      default:
        newSrc = originalSrc;
    }
  }

  //웹소켓 관련
  //===========================//

  //웹소켓 연결
  socket.addEventListener("open", () => {
    console.log("WebSocket is open");
  });

  //서버로부터 메세지 수신
  socket.addEventListener("message", (event) => {
    console.log("Message from server:", event.data);
  });


  var count = 0;
  count++;
  changeImage(emotion);
  if(count%PHASE_DEPTH ==0){
    showNextBackground();
  }
});