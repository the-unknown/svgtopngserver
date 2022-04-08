# SVG to PNG Convertion Server
This is a simple nodeJS server, to convert SVG to PNG

It requires imagemagick to be installed on the system.
There is also a "ready to roll" docker image in DockerHub:
https://hub.docker.com/r/pixelquadrat/svgpngconverter

## What is the reason for this project?
There are several possibilities to convert SVG to PNG in the browser. But there are high differences in browser support.
While Firefox has the most reliable implementation, Chrome, Edge and Safari struggle a lot with this for various reasons.
In order to provide a stable performance in SVG to PNG convertion, I created this little server to reliably and fast convert SVG to PNG.

## Startup
To start the server do the following command:
```bash
    yarn && node .
```

## Requests
The server expects a POST request with a JSON body, containing the SVG as base64 string.
It will then save the image to the folder "images", convert it to PNG and will return a JSON containing the PNG as base64 string.

### Example implementation
This is an example using fetch in JavaScript

```javascript
    const convertSVGtoPNG = (svgstring) {
      const headers = new Headers()
      headers.append('Content-Type', 'application/json')

      const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          svg: svgstring,})
      }

      const response = await fetch(`https://svgtopng.example.com`, requestOptions)
      const data = await response.json()
    }
```    

### Example Request
This is a simple request:
```JSON
   {
    "svg": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KICAgICAgICAgPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MCIgaGVpZ2h0PSIyMTAiIHZlcnNpb249IjEuMSI+CiAgICAgICAgICAgIDxkZWZzPgogICAgICAgICAgICAgICAgCiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPSJHcmFkaWVudDEiIHgxPSIwIiB4Mj0iMCIgeTE9IjAiIHkyPSIxIj4KICAgICAgICAKICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSJyZ2JhKDI0MCwgMjQwLCAyNDAsIDAuOSkiIG9mZnNldD0iMCUiPjwvc3RvcD4KICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSJyZ2JhKDI0MCwgMjQwLCAyNDAsIDAuOSkiIG9mZnNldD0iMTAwJSI+PC9zdG9wPgogICAgICAgIAogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgICAgICAgICA8c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWwogICAgICAgICAgICAgICAgICAgICN0ZXh0IHtmaWxsOiB1cmwoI0dyYWRpZW50MSk7fQogICAgICAgICAgICAgICAgICAgIAogICAgICAgIAogICAgQGZvbnQtZmFjZSB7CiAgICAgIGZvbnQtZmFtaWx5OiAnYWxsdXJhJzsKICAgICAgc3JjOiB1cmwoJy4vc3RhdGljL2ZvbnRzL2FsbHVyYS1yZWd1bGFyLXdlYmZvbnQud29mZjInKSBmb3JtYXQoJ3dvZmYyJyksCiAgICAgICAgdXJsKCcuL3N0YXRpYy9mb250cy9hbGx1cmEtcmVndWxhci13ZWJmb250LndvZmYnKSBmb3JtYXQoJ3dvZmYnKTsKICAgICAgZm9udC13ZWlnaHQ6IG5vcm1hbDsKICAgICAgZm9udC1zdHlsZTogbm9ybWFsOwogICAgfQogICAgICAjdGV4dCB7Zm9udC1mYW1pbHk6IGFsbHVyYTt9CiAgICAgIAogICAgCiAgICAgICAgICAgICAgICAgICAgI3Rlc3Qge2ZpbGw6IHVybCgjR3JhZGllbnQxKTt9CiAgICAgICAgICAgICAgICBdXT48L3N0eWxlPgogICAgICAgICAgICA8L2RlZnM+CiAgICAgICAgICAgIDx0ZXh0IGlkPSJ0ZXh0IiB4PSIxMCIgeT0iMTIwIiBmb250LXNpemU9IjE0MCI+YTwvdGV4dD4KICAgICAgICA8L3N2Zz4="
   }
```

### Example Answer
This is the answer from the server:
```JSON
   {
    "png": "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"
   }
```   
   
