# notion-to-text

A simple way to get content of notion.site pages in plain text (e.g. for use with `curl`, etc.).

## Run it locally

### Command-line

```sh
# npm run cli [a *.notion.site url]
npm run cli "https://pirafrank.notion.site"
```

### Server

Start the server

```sh
npm run server
```

then make a GET call adding your hostname at the beginning. Two first level paths are available: `text` for `text/plain` response, `json` for a JSON one.

For example:

Notion page URL|API call|Response type
---|---|---
`https://pirafrank.notion.site`|`http://localhost:3000/json/pirafrank.notion.site`|application/json
`https://pirafrank.notion.site/My-toolbelt-c3e17a2462d64b549e3ec7009e6f3071`|`http://localhost:3000/text/pirafrank.notion.site/My-toolbelt-c3e17a2462d64b549e3ec7009e6f3071`|text/plain

In case of error, you'll always get an `application/json` response.

## License

MIT
