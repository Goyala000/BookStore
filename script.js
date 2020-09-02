class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book) {
        // Creating book list
        const list = document.getElementById('bookList');

        // Creating row
        const row = document.createElement('tr');

        // Adding data
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;
        // Appending to list
        list.appendChild(row);
    }

    // Alert function
    showAlert(message, className) {
        // Creating div
        const div = document.createElement('div');
        // Giving classname to div which is designed in CSS
        div.className = `alert ${className}`;
        // Appending message to div
        div.appendChild(document.createTextNode(message))

        // Get parent
        const row = document.querySelector('.row');

        const formData = document.getElementById('book');

        row.insertBefore(div, formData);

        // Creating timeout
        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target) {
        if(target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        // Clearing respective fields
        document.getElementById('bName').value = "";
        document.getElementById('author').value = "";
        document.getElementById('isbn').value = "";
    }
}

// Local Storage Class
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book) {
            const ui = new UI();

            // Add Book to UI
            ui.addBookToList(book);
        });
    }

    static addBooks(book) {
        const books = Store.getBooks();

        books.push(book);
        
        localStorage.setItem('books', JSON.stringify(books));

    }

    static deleteBooks(isbn) {
        const books = Store.getBooks();

        books.forEach(function(book, index) {
            if(book.isbn === isbn) {
                books.splice(index,1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}


// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);


// Adding event listener to form
document.getElementById('book').addEventListener('submit', getDetails);

function getDetails(e) {

    // Get form values
    const title = document.getElementById('bName').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    // Instaniating book
    const book = new Book(title, author, isbn);

    // Instaniate UI
    const ui = new UI();

    // Validating book details
    if(title==="" || author==="" || isbn==="") {
        ui.showAlert("Please fill in the fields", "alert");
    } else {
        // Add book to list
        ui.showAlert("Book added successfully", "success");
        ui.addBookToList(book);

        // Add book to Local Storage
        Store.addBooks(book);

        // Clear fields
        ui.clearFields();
 
        e.preventDefault();
    }

}

// Adding event listener to table predefined
const del = document.getElementById('bookList').addEventListener('click', function(e) {

    // Instaniate UI
    const ui = new UI();

    // Delete Book
    ui.deleteBook(e.target);
    ui.showAlert("Book removed Successfully", "success");

    // Delete Book from Local Storage
    Store.deleteBooks(e.target.parentElement.previousElementSibling.textContent);

    e.preventDefault();
});
