// 모바일 횐경 확인
function isMobile() {
  let userAgent = navigator.userAgent;
  let mobile = /(iPhone|iPad|Android|BlackBerry|Windows Phone)/i.test(
    userAgent
  );
  return mobile;
}
const mediaQueryList = matchMedia("(max-width: 600px)");

if (isMobile() && mediaQueryList.matches === true) {
  console.log("현재 장치는 모바일입니다. ");
  window.addEventListener("touchmove", handleTouchEvent); // 터치 이벤트
} else if (isMobile() && mediaQueryList.matches === false) {
  console.log("현재 장치는 모바일이지만 화면의 크기가 600px이상입니다.");
} else if (!isMobile() && mediaQueryList.matches === true) {
  console.log("현재 장치는 모바일이 아니지만 화면의 크기가 600px이하입니다.");
} else {
  console.log("현재 장치는 모바일이 아니지만 화면의 크기가 600px이상입니다.");
}

window.addEventListener("resize", function () {
  if (isMobile() && mediaQueryList.matches === true) {
    console.log("현재 장치는 모바일입니다. ");
    window.addEventListener("touchmove", handleTouchEvent); // 터치 이벤트
  } else if (isMobile() && mediaQueryList.matches === false) {
    console.log("현재 장치는 모바일이지만 화면의 크기가 600px이상입니다.");
  } else if (!isMobile() && mediaQueryList.matches === true) {
    console.log("현재 장치는 모바일이 아니지만 화면의 크기가 600px이하입니다.");
  } else {
    console.log("현재 장치는 모바일이 아니지만 화면의 크기가 600px이상입니다.");
  }
});

// https://newsapi.org/docs/endpoints/top-headlines
let articleData = [];

let keyword;
let headlinesContainer = document.querySelector(".headlines_container");
let searchBar = document.getElementById("search_bar");
let searchBtn = document.getElementById("search");
let keywordSelect = document.querySelectorAll(".keyword span");
const apiKey = "6bc0ad2a24d84210942031272eb86f72";

let topTitle;
let imgContainer;
let headlinesImg;
let publishedDate;
let newsLink;
let journalName;
let preview;
let headlinesList;

let date = new Date();
let thisYear = date.getFullYear();
let thisMonth = date.getMonth() + 1;
let today = date.getDate();

if (thisMonth < 10) {
  thisMonth = "0" + thisMonth;
} else {
  thisMonth = thisMonth;
}
let from = `${thisYear}-${thisMonth}-${today - 1}`;
let to = `${thisYear}-${thisMonth}-${today}`;

let url = `https://newsapi.org/v2/top-headlines?country=kr&from=${from}&to=${to}&pageSize=50&sortBy=popularity&apiKey=${apiKey}`;
//let url = "../data.json";

async function arrayNews(url) {
  try {
    const options = {
      method: "GET",
    };

    const response = await fetch(url, options);

    const result = await response.json();
    //articleData = result;
    articleData = result.articles;
    // let keyword = document.querySelectorAll(".keyword span");
    // keyword.forEach((element) => {
    //   if (element.className === "active") {

    //     let articleNum = document.querySelectorAll(".number");
    //     articleNum.textContent = `(${articleData.length})`;
    //   }
    // });

    clearHeadlines(); // 이전 결과삭제
    createHeadlinesList(); // 새로운 결과 추가
    hoverEffect();
  } catch (error) {
    console.error(error);
  }
}
// 최초 실행
arrayNews(url);

searchBar.addEventListener("change", function (event) {
  keyword = event.target.value;
});

searchBar.addEventListener("keyup", function (event) {
  if (event.key === "Enter" || event.keyCode === 13) {
    keyword = event.target.value;
    searchBtn.click();
  }
});

searchBtn.addEventListener("click", async function (url) {
  //url = "../data.json";
  url = `https://newsapi.org/v2/top-headlines?q=${keyword}&country=kr&from=${from}&to=${to}&pageSize=50&sortBy=popularity&apiKey=${apiKey}`;
  await arrayNews(url);
});

// 키워드 선택 시 실행
keywordSelect.forEach((keyword) => {
  if (keyword) {
    keyword.addEventListener("click", async function () {
      let selectedKeyword = keyword.getAttribute("id");
      let url = `https://newsapi.org/v2/top-headlines?country=kr&from=${from}&to=${to}&category=${selectedKeyword}&pageSize=50&sortBy=popularity&apiKey=${apiKey}`;

      try {
        // API 호출 및 뉴스 업데이트
        await arrayNews(url);

        // 모든 키워드에서 active 클래스 제거
        keywordSelect.forEach((k) => k.classList.remove("active"));

        // 선택된 키워드에만 active 클래스 추가
        keyword.classList.add("active");
      } catch (error) {
        console.error("뉴스 에러:", error);
      }
    });
  }
});

// 뉴스리스트에 마우스 enter/leave 효과
function hoverEffect() {
  let newsList = document.querySelectorAll(".headlines_container a li");
  newsList.forEach((list) => {
    // offsetHeight, clientHeight 값이 같음
    list.addEventListener("mouseenter", function () {
      list.style.height = `${list.clientHeight + 200}px`;
    });
    list.addEventListener("mouseleave", function () {
      list.style.height = `${list.clientHeight - 200}px`;
    });
  });
}

// 검색시 기존 검색 뉴스 리스트 삭제
function clearHeadlines() {
  const headlinesList = headlinesContainer.querySelectorAll("a");
  for (let i = 0; i < headlinesList.length; i++) {
    headlinesContainer.removeChild(headlinesList[i]);
  }
}

// 뉴스 기사 element 생성
function createHeadlinesList() {
  articleData.forEach((items) => {
    headlinesList = document.createElement("li");
    topTitle = document.createElement("h2");
    imgContainer = document.createElement("div");
    headlinesImg = document.createElement("img");
    publishedDate = document.createElement("div");
    newsLink = document.createElement("a");
    journalName = document.createElement("p");
    preview = document.createElement("p");

    headlinesList.appendChild(topTitle);
    newsLink.appendChild(headlinesList);
    imgContainer.appendChild(journalName);
    imgContainer.appendChild(headlinesImg);
    headlinesList.appendChild(imgContainer);
    headlinesList.appendChild(publishedDate);
    headlinesList.appendChild(preview);
    headlinesContainer.appendChild(newsLink);

    preview.classList.add("preview");
    imgContainer.classList.add("img_container");

    journalName.classList.add("journal_name");
    topTitle.classList.add("top_title");

    if (items.title.match(/- (.*)/)) {
      let textMatch = items.title.match(/- (.*)/);
      journalName.textContent = textMatch[1];
    }

    topTitle.textContent = items.title.replace(/- .*/g, "");

    // 강조할 텍스트 찾기
    let emphasizeMatches = topTitle.textContent.match(
      /'[^']*'|‘[^']*’|“[^”]*”|"[^"]*"|\[[^\]]*\]|′[^]*′/g
    );

    if (emphasizeMatches) {
      let originalText = topTitle.textContent;
      let emphasizedHTML = originalText;

      // 강조할 부분을 <strong> 태그로 감쌈, 대괄호와 다른 따옴표 구분
      emphasizeMatches.forEach((match) => {
        if (match.startsWith("[")) {
          emphasizedHTML = emphasizedHTML.replace(
            match,
            `<strong class="emphasize-brackets">${match}</strong>`
          );
        } else {
          emphasizedHTML = emphasizedHTML.replace(
            match,
            `<strong class="emphasize">${match}</strong>`
          );
        }
      });

      // HTML로 설정
      topTitle.innerHTML = emphasizedHTML;
    }

    if (items.urlToImage === null || !items.urlToImage.includes("https")) {
      headlinesImg.src = "../img/no-image.png";
    } else {
      headlinesImg.src = items.urlToImage;
    }
    publishedDate.textContent = addNineHoursToUTC(items.publishedAt);
    publishedDate.classList.add("published");
    newsLink.href = items.url;
    preview.textContent = items.description;
  });
}

function handleTouchEvent() {
  handleScrollEvent();
}

function handleScrollEvent() {
  const centerY = window.innerHeight / 2;
  const centerX = window.innerWidth / 2;

  const element = document.elementFromPoint(centerX, centerY);

  const newsLinks = document.querySelectorAll(".headlines_container a");
  newsLinks.forEach((newsLink) => {
    const img = newsLink.querySelector("img");
    const previewElement = newsLink.querySelector(".preview");
    const headlinesList = newsLink.querySelector("li");

    const imgRect = img.getBoundingClientRect();
    const imgCenterY = imgRect.top + imgRect.height / 2;

    // // 높이 조정 상태를 저장하기 위한 데이터 속성 사용
    if (!newsLink.dataset.heightAdjusted) {
      newsLink.dataset.heightAdjusted = "false";
    }

    if (
      imgCenterY >= centerY - 60 &&
      imgCenterY <= centerY + 60 &&
      newsLink.dataset.heightAdjusted === "false"
    ) {
      headlinesList.style.height = `${headlinesList.clientHeight + 200}px`;
      previewElement.style.opacity = 1;
      newsLink.dataset.heightAdjusted = "true"; // 높이가 조정되었음을 표시
    } else if (imgCenterY < centerY - 60 || imgCenterY > centerY + 60) {
      headlinesList.style.height = ""; // 높이를 원래대로 되돌림
      previewElement.style.opacity = 0;
      newsLink.dataset.heightAdjusted = "false"; // 높이 조정 플래그를 초기화
    }
  });
}

function addNineHoursToUTC(utcString) {
  // UTC 시간 문자열을 Date 객체로 변환
  let utcDate = new Date(utcString);

  // 9시간을 더하여 한국 시간으로 변환
  utcDate.setUTCHours(utcDate.getUTCHours() + 9);

  // 24를 초과하는 경우 일자를 1일 증가시킴
  if (utcDate.getUTCHours() >= 24) {
    utcDate.setUTCDate(utcDate.getUTCDate() + 1);
  }

  // 변환된 날짜를 ISO 8601 형식 문자열로 변환
  let year = utcDate.getUTCFullYear();
  let month = String(utcDate.getUTCMonth() + 1).padStart(2, "0");
  let day = String(utcDate.getUTCDate()).padStart(2, "0");
  let hours = String(utcDate.getUTCHours()).padStart(2, "0");
  let minutes = String(utcDate.getUTCMinutes()).padStart(2, "0");

  let koreaDateString = `${year}-${month}-${day} ${hours}시 ${minutes}분`;

  return koreaDateString;
}

// 스크롤 맨 처음으로 올리놓기
let topScroll = document.getElementById("to-top");
topScroll.addEventListener("click", function () {
  window.scrollTo(0, 0);
});
