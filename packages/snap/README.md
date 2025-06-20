# VSL Wallet Snap

The VSL Wallet **Snap** that lets you create, manage, and use VSL accounts directly from any dApp. The snap calls `JSON-RPC` over `wallet_invokeSnap` and `keyring_<keyring_methods>`, and forwards the call to a VSL node and signs message for you.

## Getting Started

### Prerequisites

* Node.js (22.0+) with `npm` installed.
* [MetaMask Flask](https://docs.metamask.io/snaps/get-started/install-flask/) Browser Extension.
* (Optional) VSL Core Service running locally.

### Setting up

At the root directory, run

```bash
npm install
```

### Running Locally

Make sure you have VSL core server running locally at `localhost:44444`, then run

```shell
npm run dev
```

This will start the snap provider at `8080`. The snap will listen to the VSL core server at `44444`.

### Running Locally, Connected to remote VSL server

This will use the remote VSL server at `https://rpc.vsl.pi2.network`, then run

```shell
npm run dev:remote
```

This will start the snap provider at `8080`. The snap will listen to the remote VSL server.

### Build for production release

First build the snap

```shell
npm run build
```

This will generate the release file `bundle.js` under `dist` folder. If you want to ensure that previous build are removed, run

```shell
npm run clean
```

Then run the pre-publish checks (see MetaMask Snap [publish guideline](https://docs.metamask.io/snaps/how-to/publish-a-snap/))

```shell
npm run prepublish
```

### Testing (TODO)

To run test for the snap, run

```shell
npm run test
```

Note, the test is incomplete yet and should not be used for now.

### Debugging

To see Snap console output for debugging. Open chromium-based browser, open `chrome:://extensions/`, turns on **Developer mode** and click on MetaMask Flask extension. Then click on the `offscreen.html` link to open the browser console. Note that this specific browser console seems not able to show object details after logging the object. If that happens, use `JSON.stringify(obj, null, 2)` to show object in formatted string.

## Configurations

### Snap Configuration

There are two snap configuration files for development and production. `snap.dev.config.ts` are for development configuration, `npm run dev` will use it. `snap.prod.config.ts` are for production configuration, `npm run dev:remote`, `npm run build` and `npm run prepublish` will use it.

Configuration file looks like below:

```typescript
const config = {
    input: resolve(__dirname, "src/index.ts"),
    server: {
        port: 8080,
    },
    environment: {
        VSL_ENDPOINT: "https://rpc.vsl.pi2.network",
    },
    // ... other properties ignored
};
```

You could change the port that snap is hosted on, and the VSL endpoint that snap connects to. If you choose to use port other than `8080`, make sure that your companion application are configured to use the new snap provider port. By default, local VSL endpoint are `http://127.0.0.1:44444` and remote VSL endpoint are `https://https://rpc.vsl.pi2.network`, note that you need to use `127.0.0.1` instead of `localhost` as currently VSL server does not expose `ipv6` `localhost` endpoint, and node by default use `ipv6` for resolving `localhost`, which will result in errors.

### Snap Manifest JSON

There is the `snap.manifest.json` in the repository. Specifically, few keys are of importance here:

```json
{
  "initialPermissions": {
    "endowment:keyring": {
      "allowedOrigins": [
        "http://localhost:8000",
        "http://localhost:8001",
        "http://213.133.110.20:8000",
        "http://213.133.110.20:8001"
      ]
    },
    "snap_dialog": {},
    "endowment:rpc": {
      "dapps": true,
      "snaps": true
    },
    "endowment:network-access": {},
    "snap_manageAccounts": {},
    "snap_manageState": {}
  }
}
```

You need to list all dApp inside `allowedOrigins`, so that your `dApp` could access the snap. Note that currently all these endowment are required for the functionality. For more information about endowment, refer to [Snaps Permissions](https://docs.metamask.io/snaps/reference/permissions/) at MetaMask website.

## Project Structure

```text
snap/
├── src
│   ├── schema
│   │   ├── rpc
│   │   │   ├── rpc_*.tsx
│   │   │   ├── config.ts
│   │   │   └── schema.ts
│   │   ├── util
│   │   │   ├── helper.ts
│   │   │   ├── integer.ts
│   │   │   └── string.ts
│   │   └── vsl
│   │       ├── config.ts
│   │       ├── schema.ts
│   │       └── vsl_*.ts
│   ├── tests (TODO)
│   ├── encoding.ts
│   ├── index.test.tsx
│   ├── index.ts
│   ├── keyring.ts
│   ├── rpc.ts
│   ├── signing.ts`
│   ├── vsl.ts
│   └── (util files ignored)
└── (config files ignored)
```

* `index.ts` is the entry point of the snap, it registers few [snap entry points](https://docs.metamask.io/snaps/reference/entry-points/)
* `index.test.ts` is the testing entry point of the snap, (TODO) the `tests` folder will include testing functions for each snap endpoints.
* `keyring.ts` contains `VSLKeyring` class that implements the `Keyring` with methods for account management.
* `rpc.ts` contains handler logic for Snap RPC request.
* `vsl.ts` contains handler for calling VSL method.
* `encoding.ts` contains `RLP` encoding methods, `signing.ts` contains `EVM`-like signing methods.
* `schema/rpc` contains `Zod` schema for Snap RPC endpoints for input / return validation. `schema.ts` defines commonly used Snap RPC schema.
* `schema/vsl` contains `Zod` schema for VSL endpoints for input / return validation. `schema.ts` defines commonly used VSL schema.
* `schema/util` defines helper function and useful data type schema that is used both by Snap RPC schema and VSL schema.

## Endpoints

Note that you generally call these methods using MetaMask libraries.

### Snap RPC methods

The way to call Snap RPC methods looks like below:

```typescript
const result = await provider.request({
    method: 'wallet_invokeSnap',
    params: {
        snapId: <snap-server-url>,
        request: {
            method: <methods>,
            params: <params>
        }
    }
});
```

The provider is mentioned in [Snap Wallet API](https://docs.metamask.io/wallet/). Following Wallet RPC methods are currently supported:

* `createAsset`
* `getAssetBalance`
* `getAssetBalances`
* `getBalance`
* `getHealth`
* `submitClaim`
* `transferAsset`
* `transferBalance`

#### `createAsset`

##### Inputs

A `Signed Snap RPC Method Parameter` with

* `address`: `Snap Address`
* `assetName`: `Snap Asset Name`
* `assetSupply`: `Snap Asset Balance`

##### Returns

`Snap Asset ID`

##### Description

There will be a Snap dialog request for user confirmation, with `address`, `assetName`, and `assetSupply` listed. If user confirms, it will create asset under `address`, with ticker symbol equal to `assetName` and initial balance equal to `assetSupply`.

##### Errors

Will return error if

* `address` is not signer address.
* Input doesn’t confirm to the constraint.
* User rejects asset creation.
* VSL endpoints return errors.

#### `getAssetBalance`

##### Inputs

An `object` with

* `address`: `Snap Address`
* `assetId`: `Snap Asset ID`

##### Returns

`Snap Asset Balance`

##### Description

It will retrieve asset balance with specific `assetId` under `address`

##### Errors

Will return error if

* Input doesn’t confirm to the constraint.
* VSL endpoints return errors.

#### `getAssetBalances`

##### Inputs

An `object` with

* `address`: `Snap Address`

##### Returns

`Snap Asset Balances`

##### Description

It will retrieve all asset balances under `address`.

##### Errors

Will return error if

* Input doesn’t confirm to the constraint.
* VSL endpoints return errors.

#### `getBalance`

##### Inputs

An `object` with

* `address`: `Snap Address`

##### Returns

`Snap Balance`

##### Description

It will retrieve balance under `address`.

##### Errors

Will return error if

* Input doesn’t confirm to the constraint.
* VSL endpoints return errors.

#### `getHealth`

##### Inputs

Empty

##### Returns

String literal `ok`

##### Description

It will check whether VSL server is online. If success, it will return `ok`.

##### Errors

Will return error if

* VSL endpoints return errors.

#### `submitClaim`

##### Inputs

A `Signed Snap RPC Method Parameter` with

* `sender`: `Snap Address`
* `receivers`: `Snap Address Array`
* `claim`: `Snap Claim`
* `claimType`: `Snap Claim Type`
* `fee`: `Snap Fee`,
* `proof`: `Snap Proof`,
* `quorum`: `Snap Quorum`
* `assetSupply`: `Snap Asset Balance`

##### Returns

`Snap Transaction Hash`

##### Description

There will be a Snap dialog request for user confirmation, with parameters listed. If user confirms, it will submit the claim with the provided parameters.

##### Errors

Will return error if

* `sender` is not signer address.
* Input doesn’t confirm to the constraint.
* User rejects claim submission.
* VSL endpoints return errors.

#### `transferAsset`

##### Inputs

A `Signed Snap RPC Method Parameter` with

* `sender`: `Snap Address`
* `receiver`: `Snap Address`
* `assetId`: `Snap Asset ID`
* `amount`: `Snap Asset Balance`

##### Returns

`Snap Transaction Hash`

##### Description

There will be a Snap dialog request for user confirmation, with parameters listed. If user confirms, it will transfer the `amount` many asset with `assetId` from `sender` to `receiver` 

##### Errors

Will return error if

* `sender` is not signer address.
* Input doesn’t confirm to the constraint.
* User rejects transfer asset.
* VSL endpoints return errors.

#### `transferBalance`

##### Inputs

A `Signed Snap RPC Method Parameter` with

* `sender`: `Snap Address`
* `receiver`: `Snap Address`
* `amount`: `Snap Asset Balance`

##### Returns

`Snap Transaction Hash`

##### Description

There will be a Snap dialog request for user confirmation, with parameters listed. If user confirms, it will transfer the `amount` balance from `sender` to `receiver` 

##### Errors

Will return error if

* `sender` is not signer address.
* Input doesn’t confirm to the constraint.
* User rejects transfer balance.
* VSL endpoints return errors.

### Snap Keyring Methods

The way to Snap Keyring methods looks like below:

```typescript
const result = await provider.request({
    method: 'wallet_invokeKeyring',
    params: {
        snapId: <snap-server-url>,
        request: {
            jsonrpc: '2.0',
            id: uuid(),
            method: <keyring_method>,
            params: <params>
        }
    }
});
```

#### `listAccounts`

##### Inputs

Empty

##### Return

`KeyringAccount[]`: An array of all VSL accounts currently managed by the Snap.

##### Description

Retrieves all VSL accounts known to the Snap, including both created and imported accounts.

##### Errors

None



#### `getAccount`

##### Input

* `id`: `Snap Account ID`

##### Returns

`KeyringAccount | undefined`: The account object containing metadata and chain associations.

##### Description

Fetches a single VSL account by its snap account id

##### Errors

None



#### `createAccount`

##### Input

* `options` (optional): Optional configuration for account creation (e.g., label, derivation path).

##### **Returns**

`KeyringAccount`: The newly created account object that does _not_ include the private key.

##### Description

Creates a new VSL account in Snap and MetaMask with optional customization. Private key and nonce fetched from VSL are stored in Snap’s storage. The account will be shown in MetaMask Extension Panel. `options.privateKey` could be provided here for importing existing accounts, if not provided, a new account will be generated with a new private key.

##### Errors:

Will return error if

* Failed to get nonce from VSL endpoints.
* Unable to emit account creation event to MetaMask.
* Unable to store account state into Snap’s storage.



#### `deleteAccount`

##### Input

* `id`: `Snap Account ID`

##### Returns

None

##### Description

Removes an account from the Snap and MetaMask. The private key information are destroyed in the process.

##### Error

Will return error if

* Deleted account does not exist
* Unable to emit account deletion event to MetaMask.
* Unable to remove account state from Snap’s storage.



#### `updateAccount`

**Input**

* `account` (`KeyringAccount`): The updated account object with new metadata.

**Returns**

None

##### Description

Updates the metadata of an existing VSL account. Only option field will get updated, other field are ignored. If the account ID in the provided account doesn’t exists in current keyring. The function will return silently.

##### Error

Will return error if

* Unable to emit account update event to MetaMask.
* Unable to store updated account state into Snap’s storage.



#### `exportAccount`

##### Input

* `id` (`Snap Account ID`): The snap account id of the account to export.

##### Return

`KeyringAccountData`: The exported account object including its private key.

##### Description

Exports the raw account object and private key for backup or migration.

##### Error

Will return error if

* Exported account does not exist



### Snap Data Schema

#### `Signed Snap RPC Method Parameter`

A Signed Snap RPC Method Parameter with parameter `P` is an object with property

* `snapAccountId`: `Snap Account ID`
* `data`: `P`

The `snapAccountId` is the account ID where the 

#### `Snap Account ID`

Account ID used internally by snap for account management, must be a valid `uuidv4 string`.

#### `Snap Address`

Ethereum format address, should be in the form of `^0x[0-9a-fA-F]{40}$`.

#### `Snap Address Array`

An array of `Snap Address` with at least one address.

#### `Snap Asset Name`

The human readable name for the asset. Currently constraint to any valid string.

#### `Snap Asset Balance`

The balance for asset. A number, a decimal string, or a prefixed hex string that represents an unsigned 128-bit integer.

#### `Snap Asset Balances`

An object with key being `Snap Asset ID` and value being `Snap Asset Balances`

#### `Snap Asset ID`

The asset ID used by VSL. A hex string (not prefixed) of length 64.

#### `Snap Balance`

The balance for an address. A number, a decimal string, or a prefixed hex string that represents an unsigned 128-bit integer.

#### `Snap Claim`

The VSL claim. Currently constraint to any valid string.

#### `Snap Claim Type`

The VSL claim type. Currently constraint to any valid string.

#### `Snap Fee`

The fee payed for claim settlement. A number, a decimal string, or a prefixed hex string that represents an unsigned 128-bit integer.

#### `Snap Proof`

The VSL proof. Currently constraint to any valid string.

#### `Snap Quorum`

The minimum required verification from verifiers for claim to be settled. Any data that could be coerced to `bigint` via `BigInt()` that represents a 16-bit unsigned integer.

#### `Snap Transaction Hash`

The VSL transaction hash. Currently constraint to any valid string. (TODO: this should be narrower)

#### `Keyring Account`

MetaMask Keyring Account object with following fields

* `type`: `"eip155:eoa"`
* `id`: `Snap Account ID`
* `options`: `JSON-able object`
* `address`: `Snap Address`
* `scopes`: `['eip155:0']`
* `methods`: `['personal_sign', 'eth_signTypedData_v4']`

#### `Keyring Account Data`

MetaMask Keyring Account with associated data:

* `account`: `Keyring Account`
* `privateKey`: `string`
* `nonce`: `string encoded unsigned 64-bit integer`.

