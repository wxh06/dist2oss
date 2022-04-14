/* eslint-disable no-console */
import * as core from '@actions/core';
import glob from 'glob';
import path from 'path';
import _OSS from 'ali-oss';

class OSS extends _OSS {
  putSymlink: any;
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
  const files = glob.sync(core.getInput('pattern'));
  files.forEach((file) => {
    const posixPath = file.replaceAll('\\', '/');
    const targetName = path.posix.join(tag, posixPath);
    console.log(`Uploading ${targetName}`);
    store.put(targetName, file).then((result) => {
      console.log(`Successfully uploaded to ${result.url}`);
      if (stable) {
        const symlinkName = path.posix.join('latest', posixPath);
        console.log(`Linking ${symlinkName}`);
        store.putSymlink(symlinkName, targetName).then(() => {
          console.log(`Successfully linked ${symlinkName}`);
        });
      }
    });
  });
} catch (error: any) {
  core.setFailed(error.message);
}
