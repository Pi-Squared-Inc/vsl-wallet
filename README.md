# VSL MetaMask Integration

## Get Started

### Clone Repository

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

### Running locally with remove VSL server

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

to start the build version of the companion application. This will use the snap released in npm. For publishing the npm snap, run

```shell
npm run release-snap
```

and it should release the snap. (But you need to bump up the version number in the configuration files. See separate documentation for snap and companion)