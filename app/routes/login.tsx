import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';

export const loader: LoaderFunction = () => {
	const baseUrl = 'https://auth.atlassian.com/authorize';
	const params = new URLSearchParams({
		audience: 'api.atlassian.com',
		client_id: process.env.ATLASSIAN_CLIENT_ID,
		// read:jira-user allows access to information about current user
		// read:jira-work allows access to tickets, etc on JIRA
		// offline_access allows us to obtain a refresh token
		scope: 'read:jira-user read:jira-work offline_access',
		redirect_uri: 'http://localhost:3000/api/auth/callback',
		// TODO: Update this `state` value to something more appropriate!
		state: 'random',
		response_type: 'code',
		prompt: 'consent',
	});
	const url = new URL(`${baseUrl}?${params}`);
	return redirect(url.href);
};
