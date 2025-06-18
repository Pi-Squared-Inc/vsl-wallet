"use client";
import { KeyringAccount } from "@metamask/keyring-api";
import { createContext, ReactNode, useContext, useReducer } from "react";


export type VSLAccount = {
  keyringAccount: KeyringAccount;
  balance: string;
  assets: Record<string, string>;
}

export interface State {
  accounts : Record<string, VSLAccount>;

  selectedAccountId : string | undefined;
  selectedActionId : string | undefined;

  error: string | undefined;

  inputs : Record<string, string>;
}

type Action =
  | { type: 'SET_ACCOUNTS'; payload: VSLAccount[] }

  | { type: 'SET_SELECTED_ACCOUNT_ID'; payload: string }
  | { type: 'CLEAR_SELECTED_ACCOUNT_ID' }

  | { type: 'SET_SELECTED_ACTION_ID'; payload: string }
  | { type: 'CLEAR_SELECTED_ACTION_ID' }

  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }

  | { type: 'SET_INPUT'; key: string; value: string }

const initialState: State = {
  accounts: {},

  selectedAccountId: undefined,
  selectedActionId: undefined,

  error: undefined,

  inputs: {},
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ACCOUNTS':
      const accounts : Record<string, VSLAccount> = {};
      action.payload.forEach(account => {
        accounts[account.keyringAccount.id] = account
      })

      const newSelectedAccount =
        state.selectedAccountId !== undefined &&
        state.accounts[state.selectedAccountId] === undefined
          ? undefined
          : state.selectedAccountId;

      return {
        ...state,
        accounts,
        selectedAccountId: newSelectedAccount,
      }
    case 'SET_SELECTED_ACCOUNT_ID':
      return {
        ...state,
        selectedAccountId: action.payload,
      };
    case 'CLEAR_SELECTED_ACCOUNT_ID':
      return {
        ...state,
        selectedAccountId: undefined,
      };
    case 'SET_SELECTED_ACTION_ID':
      return {
        ...state,
        selectedActionId: action.payload,
      };
    case 'CLEAR_SELECTED_ACTION_ID':
      return {
        ...state,
        selectedActionId: undefined,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: undefined,
      };
    case 'SET_INPUT':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.key]: action.value,
        },
      };
  }
}

export const SnapStoreContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export function SnapStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <SnapStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </SnapStoreContext.Provider>
  );
}

export const useSnapStoreContext = () => {
  return useContext(SnapStoreContext);
};
