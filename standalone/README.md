# notion-to-text

CLI program which outputs to stdout. It also supports running as server.

## Install

using npm

```sh
npm i -g notion-to-text
```

or from sources

```sh
git clone https://github.com/pirafrank/notion-to-text
cd notion-to-text/standalone
npm link
```

## Usage

```text
ntt <command> [<args>]

Commands:
  ntt get <URL>  Get content from URL and print to stdout           [aliases: g]
  ntt serve      start the server                                   [aliases: s]

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]

Examples:
  ntt get <URL>                     get content from notion.site URL
  ntt serve                         start the server on 0.0.0.0:3000
  ntt serve --port 3001             start the server on port 3001
  ntt serve --host "192.168.0.123"  start the server and bind to given host

You need to provide one command at least.
```

```text
ntt get <URL>

Get content from URL and print to stdout

Options:
      --version  Show version number                                   [boolean]
      --help     Show help                                             [boolean]
  -j, --json     print output in JSON format                           [boolean]
```

```text
ntt serve

start the server

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
  --port     port the server listens on                 [number] [default: 3000]
  --host     address the server binds to           [string] [default: "0.0.0.0"]
```

## APIs

Just call server APIs by adding your hostname at the beginning + the response type you want to get.

These are available:

- `text` or `raw` for a `text/plain` response,

- `json` for a JSON one.

For example:

Notion page URL|Method|Endpoint|Response type
---|---|---|---
`https://pirafrank.notion.site`|`GET`|`http://localhost:3000/json/pirafrank.notion.site`|application/json
`https://pirafrank.notion.site/My-toolbelt-c3e17a2462d64b549e3ec7009e6f3071`|`GET`|`http://localhost:3000/text/pirafrank.notion.site/My-toolbelt-c3e17a2462d64b549e3ec7009e6f3071`|text/plain

In case of error, you'll always get an `application/json` response.

## package.json scripts

### Command-line

```sh
# npm run cli [a *.notion.site url]
# e.g.
npm run cli "https://pirafrank.notion.site"
```

### Server

Start the server

```sh
npm run server
```

## Development

`.vscode` folder in the repository root holds config to run/debug each module (core, standalone and lambda).

## Why

Notion is a great note-taking tool and with sites an easy way to maintain a public page. Unfortunately being a PWA you can't get page content just by using curl, so that's where notion-to-text can help.

I've created it for personal use and as such it is provided as-is with no warranties.

## License

MIT
