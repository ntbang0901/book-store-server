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
const newError = __importStar(require("http-errors"));
const userService = require("../services/User.service");
const otpService = require("../services/Otp.service");
const { json } = require("stream/consumers");
class User {
  getUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield userService.getAllUser();
        console.log(data);
        return res.json(data);
      } catch (error) {
        const err = newError.InternalServerError(
          error instanceof Error ? error.message : "Can't get message of error"
        );
        next(err);
      }
    });
  }
  getUserByUsername(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { user } = req;
        const result = yield userService.getUser(user.username);
        if (result) {
          return res.status(200).json({
            errCode: 0,
            user: result,
          });
        } else {
          return res.status(200).json({
            errCode: -1,
            message: "faild",
          });
        }
      } catch (error) {
        next(error);
      }
    });
  }

  newUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const {
          ho,
          ten,
          ngaysinh,
          gioitinh,
          diachi,
          sdt,
          email,
          username,
          password,
        } = req.body.user;
        const { user } = req.body;

        // if (
        //   !ho ||
        //   !ten ||
        //   !ngaysinh ||
        //   gioitinh === null ||
        //   !diachi ||
        //   !sdt ||
        //   !email ||
        //   !username ||
        //   !password
        // ) {
        //   next(newError.BadRequest("Missing info of new user"));
        // }
        const _ngaysinh = new Date(ngaysinh);
        const _ngaytao = new Date();
        const _ngaycapnhat = new Date();
        const num = Math.floor(Math.random() * (999999 - 100000) + 100000);

        const result = yield userService.createUser({
          id: num,
          loaiuserid: 2,
          ho,
          ten,
          ngaysinh: _ngaysinh,
          gioitinh,
          diachi,
          sdt,
          email,
          username,
          password,
          ngaytao: _ngaytao,
          ngaycapnhat: _ngaycapnhat,
          solanloginthatbai: 0,
          isactived: true,
          islocked: false,
        });
        res.status(201).json(result);
      } catch (error) {
        const err = newError.InternalServerError(
          error instanceof Error ? error.message : "Can't get message of error"
        );
        next(err);
      }
    });
  }

  createOtp(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { email } = req.body;
        let result = yield otpService.createtOTP(email);
        return res.json(result);
      } catch (error) {
        next(error);
      }
    });
  }

  verifyOTPUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { email, otp } = req.body;
        let result = yield userService.verifiedOTPCreateUser(email, otp);
        return res.status(200).json(result);
      } catch (error) {
        const err = newError.InternalServerError(
          error instanceof Error ? error.message : "Can't get message of error"
        );
        next(err);
      }
    });
  }

  updateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { data } = req.body;
        const { user } = req;
        let result = yield userService.updateUser(user.id, data);
        if (result) {
          return res.json({
            code: 200,
            message: "update success",
          });
        }
        return res.json(result);
      } catch (error) {
        const err = newError.InternalServerError(
          error instanceof Error ? error.message : "Can't get message of error"
        );
        next(err);
      }
    });
  }

  createOtpFogot(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { data } = req.body;
        let result = yield userService.FogotPassword(data);
        return res.status(200).json(result);
      } catch (error) {
        const err = newError.InternalServerError(
          error instanceof Error ? error.message : "Can't get message of error"
        );
        next(err);
      }
    });
  }

  verifiedOTPFogotPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { email, otp } = req.body;
        console.log({ email, otp });
        let result = yield userService.verifiedOTPFogotPassword(email, otp);

        return res.json(result);
      } catch (error) {
        const err = newError.InternalServerError(
          error instanceof Error ? error.message : "Can't get message of error"
        );
        next(err);
      }
    });
  }

  FogotPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { email } = req.body;
        console.log("email", email);
        let result = yield userService.FogotPassword(email);
        if (result.error === 0) {
          return res.json(result);
        }
        return res.json(result);
      } catch (error) {
        const err = newError.InternalServerError(
          error instanceof Error ? error.message : "Can't get message of error"
        );
        next(err);
      }
    });
  }
}
module.exports = new User();
