# notion-to-text as lambda

Serveless version compatible with AWS Lambda. Currently hosted on my AWS at `ntt.fpira.com`.

This version uses `chrome-aws-lambda` in place of `puppeteer` to reduce the size of zip package to deploy.

## Known limits

As a beta side-project some rough edges still exist.

- ~15 secs response time, this is because a new puppeteer-core instance is loaded per each invocation
- some invocations may lead to internal server errors

## Usage

Just prepend `ntt.fpira.com/` in front of a notion.site URL, e.g.

`https://pirafrank.notion.site/My-toolbelt-c3e17a2462d64b549e3ec7009e6f3071` -> `http://ntt.fpira.com/pirafrank.notion.site/My-toolbelt-c3e17a2462d64b549e3ec7009e6f3071`

and you'll get a `text/plain` response with page title and content.

## Available endpoints

Lambda and standalone server share same API format.

Notion page URL|Method|Endpoint|Response type
---|---|---|---
`https://pirafrank.notion.site`|`GET`|`https://ntt.fpira.com/json/pirafrank.notion.site`|application/json
`https://pirafrank.notion.site`|`GET`|`http://ntt.fpira.com/raw/pirafrank.notion.site`|text/plain
`https://pirafrank.notion.site`|`GET`|`http://ntt.fpira.com/text/pirafrank.notion.site`|text/plain

To get `text/plain` responses you may omit the `/text` path.

In case of error, you'll always get an `application/json` response.

## First deploy

```sh
npm i --only=production

zip -r function.zip .

aws lambda create-function \
--function-name notion-to-text \
--region eu-west-1 \
--code S3Bucket=notion-to-text,S3Key=function.zip \
--role ARN-ROLE \
--runtime nodejs14.x \
--handler index.handler

aws lambda update-function-configuration \
--function-name notion-to-text \
--timeout 30 \
--memory-size 1536
```

## Update function code

```sh
aws s3 cp function.zip s3://notion-to-text/function.zip

aws lambda update-function-code \
--function-name notion-to-text \
--s3-bucket notion-to-text \
--s3-key 'function.zip' \
--publish
```

## License

MIT
