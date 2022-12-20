"use strict";

const { sanpham } = require("../helpers/prisma_client");

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
exports.getProduct = void 0;
const prisma_client_1 = __importDefault(require("../helpers/prisma_client"));
const newError = __importStar(require("http-errors"));
function getProduct(
  id,
  page,
  elementOfPage,
  ten,
  loaisanphamid,
  optionsBook,
  optionsStationery
) {
  return __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const _ten = ten ? ten : "";
          let skip = (page - 1) * elementOfPage;
          let take = elementOfPage;

          const optionsBook_ = optionsBook;
          const optionsStationery_ = optionsStationery;

          const search = {
            ten: {
              contains: _ten,
            },
            loaisanphamid: loaisanphamid,
            sach:
              optionsBook_ !== undefined && loaisanphamid === 2
                ? {
                    ngonngu: {
                      id: optionsBook_["ngonngu"],
                    },
                    theloai: {
                      id: optionsBook_["theloai"],
                    },
                    tacgia: {
                      id: optionsBook_["tacgia"],
                    },
                    nhaphathanh: {
                      id: optionsBook_["nhaphathanh"],
                    },
                    namxuatban: optionsBook_["namxuatban"],
                  }
                : undefined,
            vanphongpham:
              loaisanphamid === 1
                ? {
                    thuonghieu: optionsStationery_["thuonghieu"],
                    xuatxu: optionsStationery_["xuatxu"],
                    kieudang: optionsStationery_["kieudang"],
                    loaivpp: {
                      id: optionsStationery_["loaivpp"],
                    },
                  }
                : undefined,
          };
          const searchDetail = {
            id: id,
            sach:
              optionsBook_ !== undefined && loaisanphamid === 2
                ? {
                    ngonngu: {
                      id: optionsBook_["ngonngu"],
                    },
                    theloai: {
                      id: optionsBook_["theloai"],
                    },
                    tacgia: {
                      id: optionsBook_["tacgia"],
                    },
                    nhaphathanh: {
                      id: optionsBook_["nhaphathanh"],
                    },
                    namxuatban: optionsBook_["namxuatban"],
                  }
                : undefined,
            vanphongpham:
              loaisanphamid === 1
                ? {
                    thuonghieu: optionsStationery_["thuonghieu"],
                    xuatxu: optionsStationery_["xuatxu"],
                    kieudang: optionsStationery_["kieudang"],
                    loaivpp: {
                      id: optionsStationery_["loaivpp"],
                    },
                  }
                : undefined,
          };

          const total = yield prisma_client_1.default.sanpham.count({
            where: id ? searchDetail : search,
          });

          const result = yield prisma_client_1.default.sanpham.findMany({
            skip,
            take,
            where: id ? searchDetail : search,
            include: {
              sach: {
                select: {
                  id: true,
                  loaisanphamid: true,
                  sotrang: true,
                  namxuatban: true,
                  theloai: true,
                  ngonngu: true,
                  tacgia: true,
                  nhaphathanh: true,
                },
              },
              vanphongpham: {
                select: {
                  id: true,
                  loaisanphamid: true,
                  thuonghieu: true,
                  xuatxu: true,
                  kieudang: true,
                  loaivpp: true,
                },
              },
              giasanpham: {
                select: {
                  gia: true,
                },
              },
            },
          });
          resolve({
            error: 0,
            data: result,
            page: page,
            total: total,
          });
        } catch (error) {
          const err = error;
          reject(newError.InternalServerError(err.message));
        }
      })
    );
  });
}
exports.getProduct = getProduct;
