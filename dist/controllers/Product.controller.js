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
const Product_service_1 = require("../services/Product.service");
class Product {
  getListProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { id, page = 1, elementOfPage = 10, options, ten } = req.query;

        let options_ = JSON.parse(options) || {};

        let pattern = /[^0-9]/g;
        if (id && id.match(pattern)) {
          next(newError.BadRequest("error_params"));
        }
        // const result = await getProduct(
        //   page,
        //   elementOfPage,
        //   options_["loaisanphamid"],
        //   (options_["ngonngu"]) && {
        //     ngonngu: {
        //       id: options_["ngonngu"],
        //     },
        //     theloai: {
        //       id: options_["theloai"],
        //     },
        //     tacgia: {
        //       id: options_["tacgia"],
        //     },
        //     nhaphathanh: {
        //       id: options_["nhaphathanh"],
        //     },
        //     namxuatban: options_["namxuatban"],
        //   } && (options_["thuonghieu"] !== null ? undefined : true),
        //   (options_["thuonghieu"]) && {
        //     thuonghieu: options_["thuonghieu"],
        //     xuatxu: options_["xuatxu"],
        //     kieudang: options_["kieudang"],
        //     loaivpp: {
        //       id: options_["loaivpp"],
        //     },
        //   }
        // );
        const result = yield (0, Product_service_1.getProduct)(
          +id,
          +page,
          +elementOfPage,
          ten,
          options_["loaisanphamid"],
          Object.assign({}, options_["book"]),
          Object.assign({}, options_["stationery"])
        );
        res.json(result);
        next();
      } catch (error) {
        const err = newError.InternalServerError(
          error instanceof Error ? error.message : "Can't get message of error"
        );
        next(err);
      }
    });
  }
  addNewBook(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      const { title, image, description } = req.body;
      try {
        const data = {
          image,
          title,
          description,
        };
        // await writeFile('../../json/Book.json', data);
        next();
      } catch (error) {
        const err = newError.InternalServerError(
          error instanceof Error ? error.message : "Can't get message of error"
        );
        next(err);
      }
    });
  }
  deleteBook(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      res.send("deleteBook");
    });
  }
  editBook(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      res.send("editBook");
    });
  }
}
module.exports = new Product();
