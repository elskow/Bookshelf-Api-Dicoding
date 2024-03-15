import {nanoid} from "nanoid";
import {Book} from "./model";
import Hapi from "@hapi/hapi";

const createBook = (name: string, pageCount: number, readPage: number, rest: object) => {
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    return {
        id,
        finished,
        insertedAt,
        updatedAt,
        name,
        pageCount,
        readPage,
        ...rest
    } as Book;
};

const validateCreateBook = (book: Book, h: Hapi.ResponseToolkit) => {
    if (!book.name) {
        return h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku"
        }).code(400).type("application/json");
    }

    if (book.readPage > book.pageCount) {
        return h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        }).code(400).type("application/json");
    }

    return null;
};

export {createBook, validateCreateBook};