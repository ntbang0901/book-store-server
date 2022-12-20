"use strict";
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
exports.createUser = exports.getAllUser = void 0;
const prismaClient = require("../helpers/prisma_client");
const redis_client_1 = __importDefault(require("../helpers/redis_client"));

const otp_service = require("../services/Otp.service");

const bcrypt = require("bcrypt");

function getAllUser(username) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      console.log(username);
      const result = yield prismaClient.users.findUnique({
        where: {
          username,
        },
        select: {
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

      return {
        error: 0,
        data: result,
      };
      // const data = await userModel.getAllUsers();
    } catch (error) {
      throw error;
    }
    // return data;
  });
}
exports.getAllUser = getAllUser;

function getUser(username) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await prismaClient.users.findFirst({
        where: {
          username: username,
        },
      });
      if (result) {
        delete result.password;
        resolve(result);
      } else {
        resolve(null);
      }
    } catch (error) {
      reject(newError.Unauthorized("Username is never used!"));
      // reject(error)
    }
  });
}
exports.getUser = getUser;

function createUser(userInfo) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const { ngaysinh, email, username, password, sdt } = userInfo;
      const _ngaysinh = new Date(ngaysinh);
      const _ngaytao = new Date();
      const _ngaycapnhat = new Date();
      const salt = yield bcrypt.genSalt(10);
      const _password = yield bcrypt.hash(password, salt);

      userInfo = {
        ...userInfo,
        ngaysinh: _ngaysinh,
        ngaytao: _ngaytao,
        ngaycapnhat: _ngaycapnhat,
        password: _password,
      };

      const user = yield prismaClient.users.findUnique({
        where: {
          username: username,
        },
      });

      if (user) {
        return {
          error: 1,
          message: "this username is already used",
        };
      }

      const userEmail = yield prismaClient.users.findUnique({
        where: {
          email: email,
        },
      });
      if (userEmail) {
        return {
          error: 2,

          message: "this email is already used",
        };
      }

      const userPhone = yield prismaClient.users.findUnique({
        where: {
          sdt: sdt,
        },
      });
      if (userPhone) {
        return {
          error: 3,
          message: "this phone is already used",
        };
      }

      yield redis_client_1.default.set(
        "register" + email,
        JSON.stringify(userInfo),
        { EX: 120 }
      );

      return {
        error: 0,
        elements: yield otp_service.createtOTP(email),
      };
    } catch (error) {
      throw error;
    }
  });
}
exports.createUser = createUser;

function FogotPassword(userInfo) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const { email } = userInfo;

      const userEmail = yield prismaClient.users.findUnique({
        where: {
          email: email,
        },
      });
      if (!userEmail) {
        return {
          error: 2,
          message: "email is not found",
        };
      }
      return {
        error: 0,
        elements: yield otp_service.createtOTP(email),
      };
    } catch (error) {
      throw error;
    }
  });
}
exports.FogotPassword = FogotPassword;

function verifiedOTPCreateUser(email, otp) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      let result = yield otp_service.verifyOtp(email, otp);
      if (result.code !== 200) {
        return result;
      }
      const userData = JSON.parse(
        yield redis_client_1.default.get("register" + email)
      );

      const user = yield prismaClient.users.create({
        data: userData,
      });
      if (user) {
        yield redis_client_1.default.del("register" + email);
        return {
          code: 200,
          message: "Add new user success",
        };
      }
    } catch (error) {
      throw error;
    }
    // return data;
  });
}
exports.verifiedOTPCreateUser = verifiedOTPCreateUser;

function verifiedOTPFogotPassword(email, otp) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      let result = yield otp_service.verifyOtp(email, otp);
      if (result.code !== 200) {
        return result;
      }
      return {
        code: 200,
        message: "success",
      };
    } catch (error) {
      throw error;
    }
    // return data;
  });
}

exports.verifiedOTPFogotPassword = verifiedOTPFogotPassword;

function updateUser(id, data) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const result = yield prismaClient.users.update({
        where: { id: id },
        data: data,
      });
      if (!result) {
        return {
          code: 400,
          message: "update faild",
        };
      }
      return result;
    } catch (error) {
      throw error;
    }
  });
}
exports.updateUser = updateUser;

function updatePassword(email, passwordOld) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const salt = yield bcrypt.genSalt(10);
      const newpassword = yield bcrypt.hash(passwordOld.toString(), salt);

      const result = yield prismaClient.users.update({
        where: { email: email },
        data: { password: newpassword },
      });
      if (!result) {
        return {
          code: 400,
          message: "update faild",
        };
      }
      return result;
    } catch (error) {
      throw error;
    }
  });
}
exports.updatePassword = updatePassword;
