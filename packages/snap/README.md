# VSL MetaMask Snap

A MetaMask **Snap** that lets you create, manage, and use VSL accounts directly from any dApp.
The snap speaks JSON-RPC over `wallet_invokeSnap` and `keyring_<keyring_methods>`, and
forwards the call to a local VSL node (`http://localhost:44444` by default), and signs all messages for you.

## Installation

### Prerequisites

* Node.js environment with `yarn` installed
* MetaMask **Flask** Browser Extension (snap-enabled build)
* A VSL core running at **`http://localhost:44444`**

### Quick start

Run `yarn install` to install dependencies, then run `yarn start` to start the snap.
This will start a local development server at `http://localhost:8080` by default. This package is not yet containerized, so you will need to disable CORS in your browser to allow the snap to communicate with the local VSL node.

To disable CORS in chromium-based browsers, you can use the following command:

```bash
chromium --disable-web-security --user-data-dir=/tmp/disable-cors
```

### Debugging

To see Snap console output for debugging. Open chromium-based browser, open `chrome:://extensions/`, turns on **Developer mode** and click on MetaMask Flask extension. Then click on the `offscreen.html` link to open the browser console.

## Usage

Notice that the `account_id` refers to the internal identifier of the account in the Snap's state. Not the actual VSL account address. The `asset_id` refers to the unique identifier of an asset (token) on the VSL chain.

### `wallet_invokeSnap` RPC methods

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

TODO!: Add Returns and Errors after the methods are finalized.

| RPC Methods            | Params                                                            | Description                                |
| ---------------------- | ----------------------------------------------------------------- | ------------------------------------------ |
| `vsl_createAsset`      | `account_id: string; ticker_symbol: string; total_supply: string` | Mint a new asset (token)                   |
| `vsl_getBalance`       | `account_id: string`                                              | Fetch the native VSL balance of an account |
| `vsl_pay`              | `from: string; to: string; amount: string`                        | Send a payment between two accounts        |
| `vsl_getAssetBalance`  | `account_id: string; asset_id: string`                            | Get the balance for a specific asset       |
| `vsl_getAssetBalances` | `account_id: string`                                              | List **all** asset balances for an account |

#### vsl_createAsset

Input:

* `account_id` (`string`): The snap account id that will own the new asset.
* `ticker_symbol` (`string`): The symbol representing the asset (e.g., "USD", "BTC").
* `total_supply` (`string`): The total number of tokens to be minted for this asset, represented as a string.

Returns:

* `asset_id` (`string`): The unique identifier of the newly created asset.

Description:
Creates (mints) a new asset (token) on the platform. The asset is associated with the specified account and is identified by the provided ticker symbol. The total supply parameter determines how many tokens are created at genesis.

---

#### vsl_getBalance

Input:

* `account_id` (`string`): The snap account id whose native VSL balance is to be fetched.

Returns:

* `balance` (`string`): The current balance of the native VSL token for the specified account.

Description:
Fetches the balance of the native VSL token for a given account.

---

#### vsl_pay

Input:

* `from` (`string`): The VSL account address of the sender.
* `to` (`string`): The VSL account address of the recipient.
* `amount` (`string`): The amount of native VSL tokens to transfer, represented as a string.

Returns:

* `claim_id` (`string`): the settled payment claim ID

Description:
Transfers a specified amount of native VSL tokens from one account to another. It requires that the sender has sufficient balance.

---

#### vsl_getAssetBalance

Input:

* `account_id` (`string`): The snap account id of the holder.
* `asset_id` (`string`): The VSL asset identifier whose balance is to be fetched.

Returns:

* `balance` (`string`): The balance of the specified asset for the given account.

Description:
Retrieves the balance of a specific asset (token) for a particular account.

---

#### vsl_getAssetBalances

Input:

* `account_id` (`string`): The snap account id for which to list all asset balances.

Returns:

* `balances` (`Record<string, string>`): A record where keys are asset IDs and values are their respective balances.

Description:
Lists all asset balances for a given account with balances represented as strings.

### `keyring_<keyring_methods>` RPC methods

### Example usage

```typescript
const result = await provider.request({
    method: 'keyring_<method>',
    params: {
        snapId: <snap-server-url>,
        request: {
            method: <keyring_method>,
            params: <params>
        }
    }
});
```

| Method                                             | Signature                                                                                                   | Description                                                         |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Account management**                             |                                                                                                             |                                                                     |
| `listAccounts()`                                   | `() ⇒ Promise<KeyringAccount[]>`                                                                            | Return all VSL accounts the Snap currently knows about              |
| `getAccount(id)`                                   | `(id: string) ⇒ Promise<KeyringAccount>`                                                                    | Fetch a single account by its internal ID                           |
| `createAccount(options)`                           | `(options?: Record<string, Json>) ⇒ Promise<KeyringAccount>`                                                | Create a brand‑new VSL account (on‑chain + in‑Snap state)           |
| `deleteAccount(id)`                                | `(id: string) ⇒ Promise<void>`                                                                              | Remove an account from the Snap’s state (does not delete on‑chain)  |
| `updateAccount(account)`                           | `(account: KeyringAccount) ⇒ Promise<void>`                                                                 | Modify an existing account’s metadata (label, etc.)                 |
| **Data & export**                                  |                                                                                                             |                                                                     |
| `exportAccount(id)`                                | `(id: string) ⇒ Promise<KeyringAccountData>`                                                                | Export the raw account object plus its private key                  |
| `filterAccountChains(id, chains)`                  | `(id: string, chains: string[]) ⇒ Promise<string[]>`                                                        | Return only the “vsl:”‑prefixed chains from a list                  |
| **(Unimplemented / TODO)**                         |                                                                                                             |                                                                     |
| `listAccountAssets(id)`                            | `(id: string) ⇒ Promise<CaipAssetTypeOrId[]>`                                                               | ← TODO: list CAIP assets for an account                             |
| `listAccountTransactions(id, pagination)`          | `(id: string, pagination: Pagination) ⇒ Promise<Paginated<Transaction>>`                                    | ← TODO: list on‑chain txns for an account                           |
| `discoverAccounts(scopes, entropySource, groupIndex)` | `(scopes: CaipChainId[], entropySource: EntropySourceId, groupIndex: number) ⇒ Promise<DiscoveredAccount[]>` | ← TODO: HD wallet discovery                                         |
| `getAccountBalances(id, assets)`                   | `(id: string, assets: CaipAssetType[]) ⇒ Promise<Record<CaipAssetType, Balance>>`                           | ← TODO: batch‑query balances                                        |
| **Signing gateway (TODO)**                         |                                                                                                             |                                                                     |
| `submitRequest(request)`                           | `(request: KeyringRequest) ⇒ Promise<SubmitRequestResponse>`                                                | Send an EIP‑191 / EIP‑712 / tx‑signing request through the Snap     |

---

#### listAccounts

Input:
_None_

Returns:

* `KeyringAccount[]`: An array of all VSL accounts currently managed by the Snap.

Description:
Retrieves all VSL accounts known to the Snap, including both created and imported accounts.

---

#### getAccount

Input:

* `id` (`string`): The snap account id of the account to fetch.

Returns:

* `KeyringAccount`: The account object containing metadata and chain associations.

Description:
Fetches a single VSL account by its snap account id

---

#### createAccount

Input:

* `options` (`Record<string, Json>`, optional): Optional configuration for account creation (e.g., label, derivation path). `options.privateKey` could be provided here for importing existing accounts, if not provided, a new account will be generated with a new private key.

Returns:

* `KeyringAccount`: The newly created account object that does _not_ include the private key.

Description:
Creates a new VSL account both on-chain and in the Snap's state, with optional customization.

---

#### deleteAccount

Input:

* `id` (`string`): The snap account id of the account to delete.

Returns:

* `void`: Resolves when the account has been deleted.

Description:
Removes an account from the Snap’s internal state (does not affect on-chain account).

---

#### updateAccount

Input:

* `account` (`KeyringAccount`): The updated account object with new metadata.

Returns:

* `void`: Resolves when the account has been updated.

Description:
Updates the metadata of an existing VSL account. Account address, types, and methods are immutable to ensure consistency.

---

#### exportAccount

Input:

* `id` (`string`): The snap account id of the account to export.

Returns:

* `KeyringAccountData`: The exported account object including its private key.

Description:
Exports the raw account object and private key for backup or migration.

---

#### filterAccountChains

Input:

* `id` (`string`): The snap account id of the account to filter chains for.
* `chains` (`string[]`): Array of chain identifiers to filter.

Returns:

* `string[]`: Array of filtered chain identifiers prefixed with “vsl:” and associated with the account.

Description:
Filters a list of chain IDs, returning only those supported by the account within the VSL ecosystem.
