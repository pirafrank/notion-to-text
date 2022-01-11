# notion-to-text as lambda

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
--memory-size 1024
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
