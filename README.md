# Example Keygen Dist Proxy
The following web app is written in Node.js and shows how to set up a simple
proxy server for [Keygen Dist](https://keygen.sh/distribution), allowing you
to use your own domain name for serving product releases.

> **This example application is not 100% production-ready**, but it should
> get you 90% of the way there. You may need to add additional logging,
> error handling, validation, features, etc.

## Running the app

First up, configure a few environment variables:
```bash
# Your Keygen account ID.
export KEYGEN_ACCOUNT_ID="YOUR_KEYGEN_ACCOUNT_ID"

# The Keygen product which this proxy is serving releases for.
export KEYGEN_PRODUCT_ID="YOUR_KEYGEN_PRODUCT_ID"

# The Keygen policy that allows a user the ability to download
# a release or receive an update, e.g. this could be your 'Pro'
# policy, or simply a general policy used for your licenses.
export KEYGEN_POLICY_ID="YOUR_KEYGEN_POLICY_ID"
```

You can either run each line above within your terminal session before
starting the app, or you can add the above contents to your `~/.bashrc`
file and then run `source ~/.bashrc` after saving the file.

Next, install dependencies with [`yarn`](https://yarnpkg.comg):
```
yarn
```

Then start the app:
```
yarn start
```

## Running proxy locally

For local development, create an [`ngrok`](https://ngrok.com) tunnel:
```
ngrok http 8080
```

## Testing the proxy

You can now make requests to any of the following routes:

#### `/update/:platform/:extension/:version?license=:key`

This will download an update release for a given platform depending on
the user's current version. See [the download update endpoint](https://keygen.sh/docs/dist/#releases-update)
for Keygen Dist.

#### `/latest/:platform/:extension?license=:key`

This will download the latest release for a given platform. See [the
download latest release endpoint](https://keygen.sh/docs/dist/#releases-latest)
for Keygen Dist.

#### `/download/:platform/:file?license=:key`

This will download a release by filename for a given platform. See [the
download release endpoint](https://keygen.sh/docs/dist/#releases-download)
for Keygen Dist.

## Automatically detecting platform

If you'd like to automatically detect a user's platform, that's as simple as
implementing a little bit of extra logic using something like the [`express-useragent`](https://github.com/biggora/express-useragent)
package:

```js
const userAgent = require('express-useragent')

const ua = userAgent.parse(req.headers['user-agent'])
let platform

if (ua.isMac) {
  platform = 'darwin'
} else if (ua.isWindows) {
  platform = 'win32'
} else if (us.isLinux) {
  platform = 'linux'
} else {
  // … handle other platforms
}
```

## Questions?

Reach out at [support@keygen.sh](mailto:support@keygen.sh) if you have any
questions or concerns!
