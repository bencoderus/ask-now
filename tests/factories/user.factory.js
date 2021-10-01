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
const faker_1 = __importDefault(require("faker"));
const user_service_1 = __importDefault(require("../../src/services/user.service"));
const hash_manager_1 = __importDefault(require("../../src/utils/hash-manager"));
class UserFactory {
    static create() {
        return __awaiter(this, void 0, void 0, function* () {
            const service = new user_service_1.default();
            return service.createUser({
                firstName: faker_1.default.unique.name,
                lastName: faker_1.default.unique.name,
                email: faker_1.default.internet.email(),
                username: faker_1.default.internet.userName(),
                password: hash_manager_1.default.hash('password')
            });
        });
    }
    static login() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.create();
            const service = new user_service_1.default();
            return service.login({
                email: user.email,
                password: 'password'
            });
        });
    }
}
exports.default = UserFactory;
