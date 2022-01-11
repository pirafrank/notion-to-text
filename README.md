# notion-to-text

A simple way to get content of notion.site pages in plain text (e.g. for use with `curl`, etc.).

It runs:

- in standalone, as CLI program that outputs to stdout or runs a server,
- as lambda function (AWS)

`core` module is a tiny package providing common functionality needed by standalone and lambda.

For futher details, please check the readme files per each module:

- [standalone](standalone/README.md)
- [lambda](lambda/README.md)
- [core](core/README.md)

## Why

Notion is a great note-taking tool and with sites an easy way to maintain a public page. Unfortunately being a PWA you can't get page content just by using curl, so that's where notion-to-text can help.

I've created it for personal use and as such it is provided as-is with no warranties.

## License

MIT
