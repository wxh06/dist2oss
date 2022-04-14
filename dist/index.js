"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const core = __importStar(require("@actions/core"));
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
const ali_oss_1 = __importDefault(require("ali-oss"));
class OSS extends ali_oss_1.default {
}
try {
    const tag = core.getInput('version');
    const stable = core.getBooleanInput('stable');
    const store = new OSS({
        accessKeyId: core.getInput('access-key-id'),
        accessKeySecret: core.getInput('access-key-secret'),
        bucket: core.getInput('bucket'),
        region: core.getInput('region'),
    });
    const files = glob_1.default.sync(core.getInput('pattern'));
    files.forEach((file) => {
        const posixPath = file.replaceAll('\\', '/');
        const targetName = path_1.default.posix.join(tag, posixPath);
        console.log(`Uploading ${targetName}`);
        store.put(targetName, file).then((result) => {
            console.log(`Successfully uploaded to ${result.url}`);
            if (stable) {
                const symlinkName = path_1.default.posix.join('latest', posixPath);
                console.log(`Linking ${symlinkName}`);
                store.putSymlink(symlinkName, targetName).then(() => {
                    console.log(`Successfully linked ${symlinkName}`);
                });
            }
        });
    });
}
catch (error) {
    core.setFailed(error.message);
}
