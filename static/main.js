const API_KEY = config.librarykey;

let bookList = [];
let keyword = "";

let url = new URL(
  `https://librarybooksbyjs.netlify.app/libSrch?format=json&authKey=${API_KEY}&pageNo=1&pageSize=5`
);

let totalResults = 0
let page = 1
const pageSize = 10
const groupSize = 5

document.addEventListener("DOMContentLoaded", function () {
  const queryParams = new URLSearchParams(window.location.search);
  const page = queryParams.get("page");
});

const getBooksByKeyword = async () => {
  keyword = document.getElementById("search-input").value;

  // 경고창
  if (keyword == "") {
    Swal.fire({
      icon: "warning",
      title: "검색어를 입력하세요.",
    });
  } else {
    url = new URL(
      `https://librarybooksbyjs.netlify.app/srchBooks?format=json&title=${keyword}&authKey=${API_KEY}&pageNo=1&pageSize=30`
    );

    const response = await fetch(url);
    const data = await response.json();
    const numFound = await data.response.numFound.toLocaleString();

    document.querySelector(
      ".search_result"
    ).innerHTML = `"${keyword}" 검색결과 ${numFound}건`;

    bookList = data.response.docs;
    console.log("LLL", bookList);
    searchRender();
    paginationRender();
  }
};

const searchRender = () => {
  let booksHTML = bookList
    .map(
      (books) => `<div class="row books">
    <div class="col-lg-4 img-content">
        <img class="books-img-size"
                src="${
                  books.doc.bookImageURL ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
                }" />
    </div>
    <div class="col-lg-8 books-content">
        <p id="book-name">${books.doc.bookname}</p>
        <br>
        <p>저자 : ${books.doc.authors}</p>
        <p>출판사 : ${books.doc.publisher}</p>
        <p>출판연도 : ${books.doc.publication_year}</p>
        <p>ISBN : ${books.doc.isbn13}</p>
        <p>대출건수 : ${books.doc.loan_count}</p>
        <button id="seeMore-btn">자세히보기</button>
    </div>
</div>`
    )
    .join("");
  document.getElementById("main").innerHTML = booksHTML;
};

const paginationRender = () => {
  //totalResult
  //page
  //pageSize
  //groupSize

  //pageGroup
  const pageGroup = Math.ceil(page / groupSize)
  //lastPage
  const lastPage = pageGroup * groupSize
  //firstPage
  const firstPage = lastPage - (groupSize - 1)

  let paginationHTML =``
  for(let i=firstPage; i<=lastPage;i++) {
    paginationHTML+=`<li class="page-item" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
  }
  document.querySelector(".pagination").innerHTML = paginationHTML

//   <nav aria-label="Page navigation example">
//   <ul class="pagination">
//     <li class="page-item"><a class="page-link" href="#">Previous</a></li>
//     <li class="page-item"><a class="page-link" href="#">1</a></li>
//     <li class="page-item"><a class="page-link" href="#">2</a></li>
//     <li class="page-item"><a class="page-link" href="#">3</a></li>
//     <li class="page-item"><a class="page-link" href="#">Next</a></li>
//   </ul>
// </nav>

} 

const moveToPage = (pageNum) => {
  console.log("movetopage",pageNum)
}

// 인기대출도서 조회
let popularBooks_Url = new URL(
  `https://librarybooksbyjs.netlify.app/loanItemSrch?format=json&authKey=${API_KEY}&pageNo=1&pageSize=5`
);

// 인기대출도서 불러오는 함수
const popularBooks = async () => {
  try {
    const responsePopular = await fetch(popularBooks_Url);
    const dataPopular = await responsePopular.json();
    const popularBooksList = dataPopular.response.docs;
    console.log(popularBooksList);

    const resultHTML = popularBooksList
      .map((book) => {
        return `
            <article class="swiper-slide">
              <p class="book-rank">${book.doc.ranking}</p>
              <figure>
                  <img src="${book.doc.bookImageURL}" alt="${book.doc.bookname}">
              </figure>
              <p class="book-title"><a href="${book.doc.bookDtlUrl}" target="_blank">${book.doc.bookname}</a></p>
              <p class="book-authers">${book.doc.authors}</p>
            </article>
        `;
      })
      .join("");

    document.querySelector("#popular-books-section .swiper-wrapper").innerHTML =
      resultHTML;
  } catch (error) {
    console.error("Fetching book data failed", error);
  }
};

popularBooks();

window.onload = function () {
  var swiper = new Swiper("#popular-books-section .swiper", {
    speed: 700,
    slidesPerView: 4,
    spaceBetween: 0,
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: "#popular-books-section .swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: "#popular-books-section .swiper-button-next",
      prevEl: "#popular-books-section .swiper-button-prev",
    },
  });
};

function enterkey() {
  if (window.event.keyCode == 13) {
    getBooksByKeyword();
  }
}
