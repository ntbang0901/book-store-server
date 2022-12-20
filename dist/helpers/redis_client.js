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
const redis = __importStar(require("redis"));
const PORT = process.env.REDIS_PORT;
const HOST = process.env.REDIS_HOST;

// const client = redis.createClient({
//     socket: {
//         host: HOST,
//         port: PORT
//     }
// });

const client = redis.createClient({
  url: process.env.REDIS_URI,
});
client.connect();
client.exists("a", (err, ok) => {
  if (err) throw err;
  console.log(ok);
});
client.on("error", (err) => console.log("Redis Client Error", err));
client.on("connect", (err) => console.log("Connect Redis server"));
client.ping((err, pong) => console.log(pong));

module.exports = client;
