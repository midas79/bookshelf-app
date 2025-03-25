document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  let books = [];

  // Fungsi untuk menyimpan data ke localStorage
  function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
  }

  // Fungsi untuk menampilkan buku
  function renderBooks() {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";
    books.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  }

  // Fungsi untuk membuat elemen buku
  function createBookElement(book) {
    const bookContainer = document.createElement("div");
    bookContainer.setAttribute("data-bookid", book.id);
    bookContainer.setAttribute("data-testid", "bookItem");
    bookContainer.classList.add("book-item");
    bookContainer.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${book.isComplete ? "Belum selesai" : "Selesai"} dibaca</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    // Event listener untuk tombol selesai/belum selesai dibaca
    bookContainer
      .querySelector('[data-testid="bookItemIsCompleteButton"]')
      .addEventListener("click", () => {
        book.isComplete = !book.isComplete;
        saveBooks();
        renderBooks();
      });

    // Event listener untuk tombol hapus buku
    bookContainer
      .querySelector('[data-testid="bookItemDeleteButton"]')
      .addEventListener("click", () => {
        books = books.filter((b) => b.id !== book.id);
        saveBooks();
        renderBooks();
      });

    // Event listener untuk tombol edit buku
    bookContainer
      .querySelector('[data-testid="bookItemEditButton"]')
      .addEventListener("click", () => {
        document.getElementById("bookFormTitle").value = book.title;
        document.getElementById("bookFormAuthor").value = book.author;
        document.getElementById("bookFormYear").value = book.year;
        document.getElementById("bookFormIsComplete").checked = book.isComplete;

        bookForm.setAttribute("data-editing-id", book.id);
      });

    return bookContainer;
  }

  // Event listener untuk menambahkan/mengedit buku
  bookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = parseInt(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    const editingId = bookForm.getAttribute("data-editing-id");
    if (editingId) {
      const bookIndex = books.findIndex((book) => book.id == editingId);
      if (bookIndex !== -1) {
        books[bookIndex] = { id: editingId, title, author, year, isComplete };
      }
      bookForm.removeAttribute("data-editing-id");
    } else {
      books.push({
        id: Date.now().toString(),
        title,
        author,
        year,
        isComplete,
      });
    }

    bookForm.reset();
    saveBooks();
    renderBooks();
  });

  // Event listener untuk pencarian buku
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchTitle = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";
    books.forEach((book) => {
      if (book.title.toLowerCase().includes(searchTitle)) {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
          completeBookList.appendChild(bookElement);
        } else {
          incompleteBookList.appendChild(bookElement);
        }
      }
    });
  });

  // Load data dari localStorage saat halaman dimuat
  const storedBooks = localStorage.getItem("books");
  if (storedBooks) {
    books = JSON.parse(storedBooks);
    renderBooks();
  }
});
