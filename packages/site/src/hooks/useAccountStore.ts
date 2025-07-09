import { useAccountStoreContext } from "./AccountStoreContext";

let errorTimeout: ReturnType<typeof setTimeout> | null = null;

export const useAccountStore = () => {
    const { state, dispatch } = useAccountStoreContext();

    const cancelAutoClearError = () => {
        if (errorTimeout !== null) {
            clearTimeout(errorTimeout);
            errorTimeout = null;
        }
    }

    const setError = (error: string) => {
        cancelAutoClearError();
        dispatch({
            type: 'SET_ERROR',
            payload: error,
        });

        errorTimeout = setTimeout(() => {
            dispatch({ type: 'CLEAR_ERROR' });
            errorTimeout = null;
        }, 10000);
    }

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    }

    const selectAccountId = (id: string) => {
        if (id === state.selectedAccountId) {
            dispatch({ type: 'CLEAR_SELECTED_ACCOUNT_ID' });
        } else {
            dispatch({ type: 'SET_SELECTED_ACCOUNT_ID', payload: id });
        }
    }

    const selectActionId = (action: string) => {
        dispatch({ type: 'SET_SELECTED_ACTION_ID', payload: action });
    }

    const setInput = (key: string, value: string) => {
        dispatch({
            type: 'SET_INPUT',
            key,
            value,
        });
    }

    return {
        setError,
        clearError,
        selectAccountId,
        selectActionId,
        setInput,
    }
}