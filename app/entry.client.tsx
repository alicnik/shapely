import * as React from 'react';
import { useState } from 'react';
import { hydrate } from 'react-dom';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createEmotionCache } from './utils/emotionCache';
import { ClientStyleContextProvider } from './context/ClientStyleContext';
import theme from './utils/theme';
import { RemixBrowser } from '@remix-run/react';

interface ClientCacheProviderProps {
	children: React.ReactNode;
}
function ClientCacheProvider({ children }: ClientCacheProviderProps) {
	const [cache, setCache] = useState(createEmotionCache());

	function reset() {
		setCache(createEmotionCache());
	}

	return (
		<ClientStyleContextProvider reset={reset}>
			<CacheProvider value={cache}>{children}</CacheProvider>
		</ClientStyleContextProvider>
	);
}

hydrate(
	<ClientCacheProvider>
		<ThemeProvider theme={theme}>
			{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
			<CssBaseline />
			<RemixBrowser />
		</ThemeProvider>
	</ClientCacheProvider>,
	document
);
