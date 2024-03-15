import Hapi from "@hapi/hapi";

import {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    updateBookByIdHandler,
    deleteBookByIdHandler
} from "./handler";

const routes: Hapi.ServerRoute[] = [
    {
        method: 'GET',
        path: '/',
        handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
            return h.response({message: "Hello World!"});
        }
    },
    {
        method: 'POST',
        path: '/books',
        handler: addBookHandler,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler,
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: getBookByIdHandler,
    },
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: updateBookByIdHandler,
    },
    {
        method: 'DELETE',
        path: '/books/{id}',
        handler: deleteBookByIdHandler,
    },
    {
        method: '*',
        path: '/{any*}',
        handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
            return h.response().code(404);
        }
    }
];

export default routes;