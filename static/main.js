const API_KEY = config.librarykey;

let bookList = [];
let keyword = "";

let url = new URL(
  `https://librarybooksbyjs.netlify.app/libSrch?format=json&authKey=${API_KEY}&pageNo=1&pageSize=5`
);

const getBooks = async () => {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  const numFound = await data.response.numFound.toLocaleString();

  // 검색결과 건수 나오는 부분으로 render 함수가 생기면 render 함수 위치로 변경 예정
  document.querySelector(
    ".search_result"
  ).innerHTML = `"${keyword}" 검색결과 ${numFound}건`;
};

document.addEventListener("DOMContentLoaded", function () {
  const queryParams = new URLSearchParams(window.location.search);
  const page = queryParams.get("page");

  if (page !== "details" && page !== "list") {
    // 'details or list' 페이지가 아닐 때만 getBooks 함수를 실행합니다.
    getBooks();
  }
});

const getBooksByKeyword = async () => {
  keyword = document.getElementById("search-input").value;

  url = new URL(
    `http://data4library.kr/api/srchBooks?format=json&title=${keyword}&authKey=${API_KEY}&pageNo=1&pageSize=5`
  );

  const response = await fetch(url);
  const data = await response.json();
  bookList = data.response.docs;
  console.log("LLL", bookList);
  // searchRender 부분
  searchRender();
};

const searchRender = () => {
  let booksHTML = bookList
    .map(
      (books) => `<div class="row books">
    <div class="col-lg-4">
        <img class="books-img-size"
                src="${
                  books.doc.bookImageURL ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
                }" />
    </div>
    <div class="col-lg-8">
        <h5>${books.doc.bookname}</h5>
        <br>
        <p>저자 : ${books.doc.authors}</p>
        <p>발행처 : ${books.doc.publisher}</p>
        <p>발행연도 : ${books.doc.publication_year}</p>
        <button id="seeMore-btn">자세히보기</button>
    </div>
</div>`
    )
    .join("");
  document.getElementById("books-board").innerHTML = booksHTML;
};

const enterkey = () => {
  if (window.event.keyCode == 13) {
    getBooksByKeyword();
  }
};
