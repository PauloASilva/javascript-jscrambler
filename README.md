# JScrambler Client for Browser and Node.js

- [RC configuration](#rc-configuration)
- [CLI](#cli)
  - [Required Fields](#required-fields)
  - [Output to a single file](#output-to-a-single-file)
  - [Output multiple files to a directory](#output-multiple-files-to-a-directory)
  - [Using minimatch](#using-minimatch)
  - [Using configuration file](#using-configuration-file)
- [API](#api)
  - [Quick example](#quick-example)
- [JScrambler Parameters](#jscrambler-parameters)

## RC configuration
You may put your access and secret keys into a config file if found in [these directories](https://github.com/dominictarr/rc#standards). Besides simplifying the command entry, this has the added benefit of not logging your JScrambler credentials.

Here's an example of what your `.jscramblerrc` file should look like:

```json
{
  "host": "api4.jscrambler.com",
  "port": 443,
  "keys": {
    "accessKey": "AAAA",
    "secretKey": "SSSS"
  },
  "applicationId": "XXXXX",
  "filesSrc": [
    "/path/to/src.html",
    "/path/to/src.js"
  ],
  "filesDest": "/path/to/destDir/",
  "params": {
    "stringSplitting": {
        "chunk": 1
    }
  }
}
```

Please, replace the `AAAA`, `SSSS` and `XXXXX` placeholders with your API credentials and Application ID.

You can also download this file through Jscrambler's application builder. More
information can be found [here](https://docs.jscrambler.com/api/clients.html).

## CLI
```bash
npm install -g jscrambler
```
    Usage: jscrambler [options] <file ...>

  Options:

    -h, --help                    output usage information
    -V, --version                 output the version number
    -a, --access-key <accessKey>  Access key
    -c, --config <config>         JScrambler configuration options
    -h, --host <host>             Hostname
    -i, --application-id <id>      Application ID
    -o, --output-dir <dir>        Output directory
    -p, --port <port>             Port
    -s, --secret-key <secretKey>  Secret key


### Required Fields
When making API requests you must pass valid secret and access keys, through the command line or by having a `.jscramblerrc` file. These keys are each 40 characters long, alpha numeric strings, and uppercase. You can find them in your jscramber web dashboard under `My Profile > API Credentials`. In the examples these are shortened to `AAAA` and `SSSS` for the sake of readability.

### Output to a single file
```bash
jscrambler -a AAAA -s SSSS -i APP_ID -o output.js input.js
```

### Output multiple files to a directory
```bash
jscrambler -a AAAA -s SSSS -i APP_ID -o output/ input1.js input2.js
```

### Using minimatch
```bash
jscrambler -a AAAA -s SSSS -i APP_ID -o output/ "lib/**/*.js"
```

### Using configuration file
```bash
jscrambler -c config.json
```
where `config.json` is an object optionally containing any of the JScrambler options listed [here](#jscrambler-options), using the structure described [in the RC configuration](#rc-config).


## API
```bash
npm install javascript-jscrambler
```

### Quick example
```javascript
import jScrambler from 'javascript-jscrambler';

(async () => {
  try {
    await jScrambler
      .protectAndDownload({
        keys: {
          accessKey: 'AAAA',
          secretKey: 'SSSS'
        },
        host: 'api4.jscrambler.com',
        port: 443,
        applicationId: 'APP_ID',
        filesSrc: [
          '/path/to/src.html',
          '/path/to/src.js'
        ],
        filesDest: '/path/to/destDir/',
        params: {
          stringSplitting: {
            chunk: 1
          }
        }
      });
  } catch (err) {
    console.error(err);
  }
})();
```

More detailed informations can be found [here](https://docs.jscrambler.com/api/clients.html).

## JScrambler Parameters

Please refer to [docs](https://docs.jscrambler.com/) for more information.
