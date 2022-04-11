import fs from 'fs';
import express from 'express';
import axios from 'axios';
import _OSS from 'ali-oss';

const port = process.env.PORT || 3000;
const delay = parseInt(process.env.DELAY || '4096', 10);

interface Asset {
  name: string;
  browser_download_url: string;
  content_type: string;
}

interface Release {
  assets_url: string;
  tag_name: string;
  draft: boolean;
  prerelease: boolean;
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
  if ('release' in req.body && req.body.action === 'published') {
    res.send('Release published');
    const { release }: { release: Release } = req.body;
    setTimeout(() => {
      axios.get<Asset[]>(release.assets_url, { responseType: 'json' }).then(({ data: assets }) => {
        assets.forEach((asset) => {
          if (!release.draft) {
            axios.get(asset.browser_download_url, { responseType: 'arraybuffer' }).then(({ data }) => {
              store.put(`${release.tag_name}/${asset.name}`, data, {
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
    }, delay);
  } else {
    res.send('Unknown event, ignored');
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`); // eslint-disable-line no-console
});
