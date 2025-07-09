# VSL MetaMask Integration

This repository contains an example integration between VSL (Verifiable Settlement Layer) and MetaMask using the MetaMask Snaps platform. The integration consists of two main components:

1. A MetaMask Snap that interfaces with the VSL core server to enable secure transaction signing and verification
2. A companion web application that demonstrates how to interact with the VSL snap

The integration showcases how VSL's verification capabilities can be leveraged within the MetaMask wallet environment to provide additional security guarantees for blockchain transactions.

**⚠️ Important Notice**
This is an example implementation intended for demonstration and educational purposes only. It is not production-ready code and should not be used in production environments without thorough security audits and hardening. The code serves as a reference for developers looking to understand how to integrate VSL with MetaMask Snaps.

## Getting Started

### Prerequisite

* Node.js (22.0+) with `npm` installed.
* [MetaMask Flask](https://docs.metamask.io/snaps/get-started/install-flask/) Browser Extension.
* (Optional) VSL Core Service running locally
* Clone the repository

```shell
git clone https://github.com/Pi-Squared-Inc/vsl-wallet.git
```

### Setting up

At the root directory, run

```bash
npm install
```

### Running locally

Make sure you have VSL core server running locally at `localhost:44444`, then run

```shell
npm run dev
```

This will start the companion application at port `8000` and snap provider at `8080`. The snap will listen to the VSL core server at `44444`. The companion application must run at port `8000` otherwise the it will not have the permission to call snap endpoint. Please make sure the port `8000` is available.

### Running locally with remote VSL server

```shell
npm run dev:remote
```

This will start the companion application at port `8000` and snap provider at `8080`. The snap will instead connect to the remote VSL server.

### Build for production release

```shell
npm run build
```

This will run the production build for both the companion application and snap. After building, run

```shell
npm run start-companion
```

to start the build version of the companion application. This will use the snap released in NPM. For publishing the NPM snap, run

```shell
npm run release-snap
```

and it should release the snap. (But you need to bump up the version number in the configuration files. See separate documentation for snap and companion)

### Advanced

See [Snap Readme](packages/snap/README.md) and [MetaMask Readme](packages/site/README.md) for more information. This includes details for

* How to connect to different snap provider for companion application.
* How to configure VSL endpoint for snap itself
