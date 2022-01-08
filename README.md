# notion-to-text

A simple way to get content of notion.site pages in plain text (e.g. for use with `curl`, etc.).

## Standalone

Standalone version can be executed as CLI program or as server.

### Command-line

```sh
cd standalone
# npm run cli [a *.notion.site url]
npm run cli "https://pirafrank.notion.site"
```

### Server

Start the server

```sh
cd standalone
npm run server
```

then make a GET call adding your hostname at the beginning. Two first level paths are available: `text` for `text/plain` response, `json` for a JSON one.

For example:

Notion page URL|API call|Response type
---|---|---
`https://pirafrank.notion.site`|`http://localhost:3000/json/pirafrank.notion.site`|application/json
`https://pirafrank.notion.site/My-toolbelt-c3e17a2462d64b549e3ec7009e6f3071`|`http://localhost:3000/text/pirafrank.notion.site/My-toolbelt-c3e17a2462d64b549e3ec7009e6f3071`|text/plain

In case of error, you'll always get an `application/json` response.

## AWS Lambda

```sh
cd lambda

npm i --only=production

zip -r function.zip .

aws lambda create-function \
--function-name notion-to-text \
--region eu-west-1 \
--zip-file fileb://function.zip \
--role arn:aws:iam::447786545826:role/lambda-role-001 \
--runtime nodejs14.x \
--handler aws.handler
```

## License

MIT
