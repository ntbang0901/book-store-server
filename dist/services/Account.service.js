"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePass = exports.logOut = exports.verifyUser = void 0;
const jwt = require("../helpers/jsonwebtoken");
const prisma_client_1 = __importDefault(require("../helpers/prisma_client"));
const newError = __importStar(require("http-errors"));
const user_service = require("../services/User.service");
const hash_bcrypt_1 = require("../helpers/hash_bcrypt");
const redisClient = require("../helpers/redis_client");
const e = require("cors");
function verifyUser(user, pass) {
  return __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const result = yield prisma_client_1.default.users.findUnique({
            where: {
              username: user,
            },
            select: {
              username: true,
              password: true,
              id: true,
              ho: true,
              ten: true,
              islocked: true,
              loaiuserid: true,
              user_roles: {
                include: {
                  roles: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          });

          if (result) {
            const { username, password, id, islocked } = result;

            const checkExist = yield redisClient.exists(
              result.username + "countfaild",
              async (err, exist) => {
                if (err) console.log("err", err);
                return exist;
              }
            );
            if (islocked && checkExist === 1) {
              return resolve(result);
            }
            if (islocked && checkExist === 0) {
              yield prisma_client_1.default.users.update({
                where: {
                  id: id,
                },
                data: {
                  islocked: false,
                },
              });
              result.islocked = false;
            }
            const checkPass = yield (0, hash_bcrypt_1.comparePass)(
              pass,
              password
            );
            if (user == username && checkPass) {
              console.log(123);
              delete result.password;
              resolve(result);
            } else {
              if (checkExist === 1) {
                const faild = yield redisClient.get(username + "countfaild");

                if (+faild > 4) {
                  yield prisma_client_1.default.users.update({
                    where: {
                      id: id,
                    },
                    data: {
                      islocked: true,
                    },
                  });

                  resolve(null);
                }

                yield redisClient.set(username + "countfaild", +faild + 1, {
                  EX: 60 * 5,
                });
              } else {
                yield redisClient.set(username + "countfaild", 1, {
                  EX: 60 * 5,
                });
                resolve(null);
              }
            }
          }

          resolve(null);
        } catch (error) {
          reject(newError.Unauthorized("Username is never used!"));
        }
      })
    );
  });
}
exports.verifyUser = verifyUser;
// async function newLogin(data : any) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const { username, password } = data;
//             const result = await prismaClient.users.findFirst({
//                 where : {
//                     username : user
//                 }
//             });
//             if (result)
//                         reject(newError.Conflict("Username is used!"));
//             const hashPass = await genBcryptHash(password);
//             await addUser({ username, hashPass });
//             resolve(true);
//         } catch (error) {
//             reject(error);
//         }
//     })
// }
function logOut(username) {
  return __awaiter(this, void 0, void 0, function* () {
    yield redisClient.set("refToken" + username, "", { EX: 1 });
  });
}
exports.logOut = logOut;
function changePass(username, newpass) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const hashPass = yield (0, hash_bcrypt_1.genBcryptHash)(newpass);
      yield prisma_client_1.default.users.update({
        data: {
          password: hashPass,
        },
        where: {
          username: username,
        },
      });
    } catch (error) {
      const err = error;
      throw newError.InternalServerError(err.message);
    }
  });
}
exports.changePass = changePass;
