# dist2oss

GitHub Actions that upload assets to Aliyun OSS in the directory of specific version number

## Inputs

| name                | description                               | default     |
| ------------------- | ----------------------------------------- | ----------- |
| `version`           | Version number                            | required    |
| `stable`            | Whether this release is stable or not     | `true`      |
| `access-key-id`     | AliyunOSS AccessKey ID                    | required    |
| `access-key-secret` | AliyunOSS AccessKey Secret                | required    |
| `bucket`            | AliyunOSS Bucket                          | required    |
| `region`            | AliyunOSS Region                          | required    |
| `pattern`           | Pattern to match the files being uploaded | `dist/**/*` |

## Examples

### Stable release

```yaml
- name: Publish to OSS
  uses: wxh06/dist2oss@v1
  with:
    version: "6.7.6"
    stable: true
    access-key-id: ${{ secrets.OSS_ID }}
    access-key-secret: ${{ secrets.OSS_SECRET }}
    bucket: exlg
    region: oss-cn-shanghai
```

Uploaded to

- <https://exlg.oss-cn-shanghai.aliyuncs.com/6.7.6/dist/extend-luogu.min.user.js>
- <https://exlg.oss-cn-shanghai.aliyuncs.com/latest/dist/extend-luogu.min.user.js> (symlinked)

### Pre-release

```yaml
- name: Publish to OSS
  uses: wxh06/dist2oss@v1
  with:
    version: "6.7.6-pre2"
    stable: false
    access-key-id: ${{ secrets.OSS_ID }}
    access-key-secret: ${{ secrets.OSS_SECRET }}
    bucket: exlg
    region: oss-cn-shanghai
```

Uploaded to

- <https://exlg.oss-cn-shanghai.aliyuncs.com/6.7.6-pre2/dist/extend-luogu.min.user.js>
