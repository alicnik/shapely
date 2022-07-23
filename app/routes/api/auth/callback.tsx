import type { LoaderFunction } from '@remix-run/node';
import { fetch } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { createUserSession } from '~/utils';
import { prisma } from '~/utils/prisma.server';

export const loader: LoaderFunction = async ({ request }) => {
	const url = new URL(request.url);
	console.log('SEARCH PARAMS IN CALLBACK', url.searchParams);
	const authorisationCode = url.searchParams.get('code');

	invariant(authorisationCode, 'Expected an authorisation code from Atlassian');

	const accessTokenReqBody = {
		grant_type: 'authorization_code',
		client_id: process.env.ATLASSIAN_CLIENT_ID,
		client_secret: process.env.ATLASSIAN_CLIENT_SECRET,
		code: authorisationCode,
		redirect_uri: 'http://localhost:3000/api/auth/callback',
	};

	const { access_token: bearerToken, refresh_token: refreshToken } =
		await fetch('https://auth.atlassian.com/oauth/token', {
			method: 'POST',
			body: JSON.stringify(accessTokenReqBody),
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((res) => res.json());

	invariant(bearerToken, 'No bearer token received from access token request');

	const { accountId, emailAddress, avatarUrls, displayName } = await fetch(
		`https://api.atlassian.com/ex/jira/${process.env.ATLASSIAN_CLOUD_ID}//rest/api/3/myself`,
		{
			headers: {
				Authorization: `Bearer ${bearerToken}`,
				Accept: 'application/json',
			},
		}
	).then((res) => res.json());

	let user = await prisma.user.findUnique({ where: { accountId } });

	if (!user) {
		await prisma.user.create({
			data: {
				emailAddress,
				displayName,
				avatar: avatarUrls['48x48'],
				accountId,
			},
		});
	}

	console.log({ bearerToken, refreshToken });

	return createUserSession({
		request,
		bearerToken,
		refreshToken,
	});
};
