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
exports.verify = exports.createOtp = void 0;
const prismaClient = require("../helpers/prisma_client");
const mailer_1 = __importDefault(require("../helpers/mailer"));
const redis_client_1 = __importDefault(require("../helpers/redis_client"));
const bcrypt = require("bcrypt");

function createtOTP(email) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const num = Math.floor(Math.random() * (999999 - 100000) + 100000);
      const otp = num.toString();
      yield (0, mailer_1.default)({
        from: process.env.EMAIL,
        to: email,
        subject: "OTP book shop",
        text: `Your OTP is ${otp}`,
      });
      console.log("otp:::", otp);
      const salt = yield bcrypt.genSalt(10);
      const _otp = yield bcrypt.hash(otp, salt);
      yield redis_client_1.default.set(
        "OTP" + email,
        JSON.stringify({
          email: email,
          otp: _otp,
        }),
        { EX: 120 }
      );
      return {
        message: "ok",
      };
    } catch (error) {
      throw error;
    }
    // return data;
  });
}
exports.createtOTP = createtOTP;

function verifyOtp(email, otp) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const otpHolder = JSON.parse(
        yield redis_client_1.default.get("OTP" + email, email)
      );
      if (!otpHolder) {
        return {
          code: 404,
          message: "Expired OTP",
        };
      }

      const isvalid = yield bcrypt.compare(otp, otpHolder.otp);
      if (!isvalid) {
        return {
          code: 401,
          message: "invalid otp",
        };
      }
      if (isvalid && email === otpHolder.email) {
        yield redis_client_1.default.del("OTP" + email);
        return {
          code: 200,
          data: "verify success",
        };
      }
    } catch (error) {
      throw error;
    }
    // return data;
  });
}
exports.verifyOtp = verifyOtp;
