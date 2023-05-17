"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = void 0;
const express_1 = __importDefault(require("express"));
// local api goals
// 1. GET / -> send back production index.html/js/css assets
// 2. GET /cells -> list of cells in the file
// 3. POST /cells -> add a cell to the file
const serve = (port, filename, dir, useProxy) => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    // the purpose of wrapping express in a promise is to improve the error handling
    // express doesn't have a good way to handle async errors
    // this way when the cli serve.ts file calls this function if there is an error
    // starting the app it will be caught and logged
    // an example error would be if the port is already in use
    return new Promise((resolve, reject) => {
        app.listen(port, resolve).on('error', reject);
    });
});
exports.serve = serve;
