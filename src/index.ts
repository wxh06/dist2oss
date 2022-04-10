import fs from 'fs';
import express from 'express';
import axios from 'axios';
import _OSS from 'ali-oss';

const port = process.env.PORT || 3000;

interface Assest {
  name: string;
  browser_download_url: string;
  content_type: string;
}

interface Release {
  tag_name: string;
  draft: boolean;
  prerelease: boolean;
  assets: Assest[];
}

class OSS extends _OSS {
  putSymlink: any;
}

const store = new OSS(
  JSON.parse(fs.readFileSync(`${__dirname}/../ali-oss.json`, 'utf-8')),
);

const app = express();

app.use(express.json());

app.post('/payload', (req, res) => {
  const { release }: { release: Release } = req.body;
  res.end();
  release.assets.forEach((asset) => {
    if (!release.draft) {
      axios.get(asset.browser_download_url, { responseType: 'arraybuffer' }).then((response) => {
        store.put(`${release.tag_name}/${asset.name}`, response.data, {
          headers: { 'Content-Type': asset.content_type },
        }).then(() => {
          if (!release.prerelease) {
            store.putSymlink(`latest/${asset.name}`, `${release.tag_name}/${asset.name}`, {
              headers: { 'Content-Type': asset.content_type },
            });
          }
        });
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`); // eslint-disable-line no-console
});
