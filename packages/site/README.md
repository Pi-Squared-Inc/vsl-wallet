# VSL Wallet Snap Companion

The VSL Wallet **Snap** Companion that lets you interact with VSL Wallet Snap with interactive UI.

## Getting Started

### Prerequisites

* Node.js (22.0+) with `npm` installed.
* [MetaMask Flask](https://docs.metamask.io/snaps/get-started/install-flask/) Browser Extension.

### Setting up

At the root directory, run

```bash
npm install
```

### Running Locally

Make sure you have VSL MetaMask snap running locally at `localhost:8080`, then run

```shell
npm run dev
```

This will start the snap companion application at `8000`. The companion will use the snap at `localhost:8080`. 

### Running Production Build

First build the companion application

```shell
npm run build
```

Then start the application using

```shell
npm run start
```

This will run the companion application at port `8000`, using the snap provided by NPM registry. If you want to start the production build in dockerized environment, then run

```shell
make start
```

**at the parent directory**.

## Configurations

There are two environment files for development and production. `.env.developemtn` are for development configuration, `npm run dev` will use it. `.env.production` are for production configuration, `npm run build`, `npm run start` will use it. Configuration looks like below:

```shell
NEXT_PUBLIC_DEFAULT_SNAP_ORIGIN=local:http://localhost:8080
```

The `NEXT_PUBLIC_DEFAULT_SNAP_ORIGIN` specifies which snap provider to connect to. By default, the development environment will set it to `local:http://localhost:8080` while the production environment will set it to `npm:vsl-snap`.
