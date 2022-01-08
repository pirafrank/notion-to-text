aws s3 cp function.zip s3://notion-to-text/function.zip
aws lambda update-function-code \
--function-name notion-to-text \
--s3-bucket notion-to-text \
--s3-key 'function.zip' \
--publish

