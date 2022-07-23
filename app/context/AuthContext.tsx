import type { PropsWithChildren } from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import invariant from 'tiny-invariant';

export interface AuthContextData {
	isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextData>({
	isLoggedIn: false,
});

export function AuthContextProvider({
	isLoggedIn,
	children,
}: PropsWithChildren<AuthContextData>) {
	return (
		<AuthContext.Provider value={{ isLoggedIn }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuthContext() {
	const context = useContext(AuthContext);
	invariant(
		context,
		'You can only use `useAuthContext` from within a `AuthContextProvider`'
	);
	return context;
}
