import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Copyright } from './Copyright';

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<Container>
			<Box sx={{ my: 4 }}>
				{children}
				<Copyright />
			</Box>
		</Container>
	);
}
