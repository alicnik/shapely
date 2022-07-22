import type { PropsWithChildren} from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import invariant from 'tiny-invariant';

export interface ClientStyleContextData {
	reset: () => void;
}

const ClientStyleContext = createContext<ClientStyleContextData>({
	reset: () => {},
});

type ClientStyleContextProviderProps = PropsWithChildren<{
	reset: () => void;
}>;

export function ClientStyleContextProvider({
	children,
	reset,
}: ClientStyleContextProviderProps) {
	return (
		<ClientStyleContext.Provider value={{ reset }}>
			{children}
		</ClientStyleContext.Provider>
	);
}

export function useClientStyleContext() {
	const context = useContext(ClientStyleContext);
	invariant(
		context,
		'You can only use `useClientStyleContext` from within a `ClientStyleContextProvider`'
	);
	return context;
}
