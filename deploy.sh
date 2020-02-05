npm install
rm index.zip
zip -X -r index.zip .
aws lambda update-function-code --function-name codepipeline-notification --zip-file fileb://index.zip
