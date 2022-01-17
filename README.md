# notion-to-text

A simple way to get content of notion.site pages in plain text (e.g. for use with `curl`, etc.). Powered by [Puppeteer](https://github.com/puppeteer/puppeteer) and [html-to-text](https://www.npmjs.com/package/html-to-text).

Provided as:

- [standalone](standalone/README.md), a CLI program that outputs to stdout or runs a server
- [lambda](lambda/README.md) function

`core` module is a tiny package providing common functionality needed by standalone and lambda.

## Why

Notion is a great note-taking tool and with sites an easy way to maintain a public page. Unfortunately being a PWA you can't get page content just by using curl, so that's where notion-to-text can help.

I've created it for personal use and as such it is provided as-is with no warranties.

## License

MIT
