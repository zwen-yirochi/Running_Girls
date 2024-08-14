function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    //window.innerHeight: 현재 창의 뷰포트 높이를 픽셀 단위로 가져옵니다.
    //vh 변수: vh는 뷰포트 높이의 1%를 계산하여 픽셀 값으로 저장합니다.
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    //CSS의 :root에 --vh라는 변수를 정의하고, 이를 계산된 vh 값으로 설정합니다.
  }