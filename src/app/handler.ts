/**
 * #### The handler functions are used in the routes configuration in the routes.ts file.
 *
 * The handler functions are:
 * - <b>addBookHandler</b>: Adds a new book to the collection.
 * - <b>getAllBooksHandler</b>: Gets all books from the collection.
 * - <b>getBookByIdHandler</b>: Gets a book by its id.
 * - <b>updateBookByIdHandler</b>: Updates a book by its id.
 * - <b>deleteBookByIdHandler</b>: Deletes a book by its id.
 */
import Hapi from "@hapi/hapi";

import {Book, books, Payload} from "./model";
import {createBook, validateCreateBook} from "./utils";

/**
 * Adds a new book to the collection.
 *
 * The function operates in the following steps:
 * 1. Retrieves the payload from the request.
 * 2. Creates a new book using the payload.
 * 3. Validates the new book using the validateCreateBook function.
 * 4. If the new book is valid, it adds the book to the books array and returns a success response.
 */
const addBookHandler = (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const {name, pageCount, readPage, ...rest} = request.payload as Payload;

    const newBook = createBook(name, pageCount, readPage, rest);

    const validationResponse = validateCreateBook(newBook, h);
    if (validationResponse) {
        return validationResponse;
    }

    books.push(newBook);

    const isSuccess = books.some((book) => book.id === newBook.id);

    if (isSuccess) {
        return h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {bookId: newBook.id}
        }).code(201).type("application/json");
    } else {
        return h.response({
            status: "error",
            message: "Buku gagal ditambahkan"
        }).code(500).type("application/json");
    }
};

/**
 * Gets all books from the collection.
 *
 * The function operates in the following steps:
 * 1. Retrieves the query parameters from the request.
 * 2. Filters the books array based on the query parameters.
 * 3. Maps the filtered books to a new array containing only the id, name, and publisher.
 * 4. Returns a success response with the filtered books.
 */
const getAllBooksHandler = ({query: {name, reading, finished}}: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const result = books
        .filter((book: Book) =>
            (name === undefined || book.name.toLowerCase().includes(name.toLowerCase())) &&
            (reading === undefined || book.reading === Boolean(Number(reading))) &&
            (finished === undefined || book.finished === Boolean(Number(finished)))
        )
        .map(({id, name, publisher}: Book) => ({id, name, publisher}));

    return h.response({
        status: 'success',
        data: {
            books: result,
        },
    }).code(200);
};

/**
 * Gets a book by its id.
 *
 * The function operates in the following steps:
 * 1. Retrieves the id from the request parameters.
 * 2. Finds the book in the books array using the id.
 * 3. If the book is found, it returns a success response with the book data.
 * 4. If the book is not found, it returns a failure response.
 */
const getBookByIdHandler = (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const {id} = request.params;
    const book = books.find((n) => n.id === id);

    if (book) {
        return h.response({status: "success", data: {book}})
            .code(200)
            .type("application/json");
    }

    return h.response({status: "fail", message: "Buku tidak ditemukan"})
        .code(404)
        .type("application/json");
}

/**
 * Handler function for updating a book by its id.
 *
 * The function operates in the following steps:
 * 1. Retrieves the id and payload from the request.
 * 2. Checks if the name is provided and if the readPage is not greater than pageCount.
 * 3. If these conditions are met, it finds the book in the books array using the id.
 * 4. If the book is found, it updates the book with the new payload and returns a success response.
 * 5. If the book is not found, it returns a failure response.
 */
const updateBookByIdHandler = (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const {id} = request.params;
    const payload = request.payload as Payload;
    const {name, pageCount, readPage} = payload;

    const response = {
        status: "success",
        message: "Buku berhasil diperbarui",
        code: 200
    };

    if (!name) {
        response.status = "fail";
        response.message = "Gagal memperbarui buku. Mohon isi nama buku";
        response.code = 400;
    } else if (readPage > pageCount) {
        response.status = "fail";
        response.message = "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount";
        response.code = 400;
    } else {
        const book = books.find((book) => book.id === id);

        if (book) {
            book.updatedAt = new Date().toISOString();
            Object.assign(book, payload);
        } else {
            response.status = "fail";
            response.message = "Gagal memperbarui buku. Id tidak ditemukan";
            response.code = 404;
        }
    }

    return h.response(response).code(response.code).type("application/json");
}

/**
 * Handler function for deleting a book by its id.
 *
 * The function operates in the following steps:
 * 1. Retrieves the id from the request parameters.
 * 2. Finds the index of the book in the books array using the id.
 * 3. If the book is found (index is not -1), it removes the book from the books array and returns a success response.
 * 4. If the book is not found, it returns a failure response.
 */
const deleteBookByIdHandler = (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const {id} = request.params;
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        return h.response({status: "success", message: "Buku berhasil dihapus"})
            .code(200)
            .type("application/json");
    }

    return h.response({status: "fail", message: "Buku gagal dihapus. Id tidak ditemukan"})
        .code(404)
        .type("application/json");
}

export {addBookHandler, getAllBooksHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler};
