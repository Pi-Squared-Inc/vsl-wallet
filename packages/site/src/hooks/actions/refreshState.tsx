import { listAccountsAction } from "./listAccounts";
import { useAccountStoreContext } from "../AccountStoreContext";
import { getBalanceAction } from "./getBalance";
import { getAssetBalancesAction } from "./getAssetBalances";
import { useSnapReadyGuard } from "../useSnapReadyGuard";

export const refreshStateAction = {
    name: 'Refresh State',
    inputs: [],
    useHandler: () => {
        const { state, dispatch } = useAccountStoreContext();
        const guard = useSnapReadyGuard();
        const listAccount = listAccountsAction.useHandler();
        const getBalance = getBalanceAction.useHandler();
        const getAssetBalances = getAssetBalancesAction.useHandler();

        return async () => {
            guard();

            const accounts = await listAccount();
            if (accounts === undefined) return;

            // Hack to immediately update the state with the accounts
            const stateAccounts = accounts.map((account) => ({
                keyringAccount: account,
                balance: "",
                assets: {},
            }))

            for (const account of stateAccounts) {
                state.accounts[account.keyringAccount.id] = account;
            }

            const balances = await Promise.all(
                accounts.map(async (account) => await getBalance(account.id))
            )

            const assets = await Promise.all(
                accounts.map(async (account) => await getAssetBalances(account.id))
            )

            dispatch({
                type: 'SET_ACCOUNTS',
                payload: accounts.map((account, index) => ({
                    keyringAccount: account,
                    balance: balances[index],
                    assets: assets[index] as Record<string, string>,
                })),
            })
        }
    }
}