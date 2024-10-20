const addBookBtn = document.querySelector(".add-book-button");
const bookDialog = document.querySelector("#bookDialog");
const closeBtn = bookDialog.querySelector("#close-button");
const submitBtn = bookDialog.querySelector("#submit-button");
const cardTemplate = document.querySelector("#card-template");
const cardContainer = document.querySelector(".card-container");
let books = [];
let editingBookId = null;
let draggedCard = null;
addBookBtn.addEventListener("click", (e) => {
  resetForm();

  bookDialog.showModal();
});
closeBtn.addEventListener("click", (e) => {
  bookDialog.close();
});
submitBtn.addEventListener("click", (e) => {
  const image = document.getElementById("bookImage");
  const bookName = document.getElementById("bookName").value;
  const bookAuthor = document.getElementById("bookAuthor").value;
  const bookPages = document.getElementById("bookPages").value;
  const file = image.files[0];
  if (!file && !editingBookId) {
    alert("請選擇圖片");
    return;
  }
  const reader = new FileReader();

  reader.onloadend = function () {
    if (editingBookId) {
      const bookIndex = books.findIndex((b) => b.id === editingBookId);
      books[bookIndex] = {
        id: editingBookId,
        image: file ? reader.result : books[bookIndex].image,
        bookName: bookName,
        bookAuthor: bookAuthor,
        bookPages: bookPages,
      };
    } else {
      const imageURL = URL.createObjectURL(image.files[0]);
      const newBook = {
        id: Date.now(),
        image: reader.result,
        bookName: bookName,
        bookAuthor: bookAuthor,
        bookPages: bookPages,
      };
      books.push(newBook);
    }
    console.log(books);
    saveBooks();
    renderBookCards();
    bookDialog.close();
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    saveBooks();
    renderBookCards();
    bookDialog.close();
  }
});
function loadBooks() {
  const storedBooks = localStorage.getItem("books");
  if (storedBooks) {
    books = JSON.parse(storedBooks);
    renderBookCards();
  }
}
function saveBooks() {
  localStorage.setItem("books", JSON.stringify(books));
}
function renderBookCards() {
  cardContainer.innerHTML = "";
  books.forEach((book) => {
    const clone = cardTemplate.content.cloneNode(true);

    clone.querySelector(".book-cover").src = book.image;
    clone.querySelector(".name").textContent = book.bookName;
    clone.querySelector(".pages").textContent = `頁數:${book.bookPages}`;
    clone.querySelector(".author").textContent = `作者:${book.bookAuthor}`;

    const cardElement = clone.querySelector(".card");
    cardElement.draggable = true;
    const id = (cardElement.dataset.id = book.id);

    const deleteBtn = clone.querySelector(".delete-button");
    const editBtn = clone.querySelector(".edit-button");

    deleteBtn.addEventListener("click", (e) => {
      console.log("deleted");

      books = books.filter((b) => b.id !== parseInt(id));
      saveBooks();
      renderBookCards();
    });
    editBtn.addEventListener("click", (e) => {
      editBook(id);
    });
    cardContainer.appendChild(clone);
  });
}
function editBook(id) {
  const book = books.find((b) => b.id === id);
  editingBookId = id;
  const bookNameInput = document.getElementById("bookName");
  const bookAuthorInput = document.getElementById("bookAuthor");
  const bookPagesInput = document.getElementById("bookPages");
  const bookImageInput = document.getElementById("bookImage");

  bookNameInput.value = book.bookName;
  bookAuthorInput.value = book.bookAuthor;
  bookPagesInput.value = book.bookPages;
  bookImageInput.value = "";
  bookDialog.showModal();
}
function resetForm() {
  document.getElementById("bookImage").value = "";
  document.getElementById("bookName").value = "";
  document.getElementById("bookAuthor").value = "";
  document.getElementById("bookPages").value = "";
  editingBookId = null;
}
loadBooks();
const cards = document.querySelectorAll(".card");
cards.forEach((card) => {
  card.addEventListener("dragstart", () => {
    card.classList.add("dragging");
  });
  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
  });
});

cardContainer.addEventListener("dragover", initSortableList);
cardContainer.addEventListener("dragenter", (e) => e.preventDefault());

function initSortableList(e) {
  e.preventDefault();
  const draggingCard = document.querySelector(".dragging");

  let siblings = [...cardContainer.querySelectorAll(".card:not(.dragging)")];

  let nextSibling = siblings.find((sibling) => {
    return e.clientX <= sibling.offsetLeft + sibling.offsetWidth / 2;
  });

  if (nextSibling) {
    // 如果找到 nextSibling，插入到它前面
    cardContainer.insertBefore(draggingCard, nextSibling);
  } else {
    // 如果没有找到 nextSibling，插入到容器的末尾
    cardContainer.appendChild(draggingCard);
  }
}

function enableDragForCards() {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.addEventListener("dragstart", () => {
      card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
    });
  });
}

enableDragForCards();
