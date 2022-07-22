import type { LoaderFunction } from '@remix-run/node';
import { Response } from '@remix-run/node';
import { redirect } from '@remix-run/node';

export const loader: LoaderFunction = async ({ request }) => {
	const baseUrl = 'https://auth.atlassian.com/authorize';
	const params = new URLSearchParams({
		audience: 'api.atlassian.com',
		client_id: process.env.ATLASSIAN_CLIENT_ID,
		scope: 'read%3Ajira-user%20read%3Ajira-work',
		redirect_uri: encodeURI('http://localhost:3000/api/auth/callback'),
		state: 'random',
		response_type: 'code',
		prompt: 'consent',
	});
	const url = new URL(`${baseUrl}?${params}`);
	return redirect(url.href);
};
