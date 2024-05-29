// https://newsapi.org/docs/endpoints/top-headlines
let articleData = [];

let keyword;
let headlinesContainer = document.querySelector(".headlines_container");
let searchBar = document.getElementById("search_bar");
let searchBtn = document.getElementById("search");
let keywordSelect = document.querySelectorAll(".keyword span");
const apiKey = "6bc0ad2a24d84210942031272eb86f72";

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
    console.log(articleData);
    clearHeadlines(); // 이전 결과삭제
    headlinesList(); // 새로운 결과 추가
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
function headlinesList() {
  articleData.forEach((items) => {
    let headlinesList = document.createElement("li");
    let topTitle = document.createElement("h2");
    let imgContainer = document.createElement("div");
    let headlinesImg = document.createElement("img");
    let publishedDate = document.createElement("div");
    let newsLink = document.createElement("a");
    let journalName = document.createElement("p");
    let preview = document.createElement("p");

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
