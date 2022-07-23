import { createCookieSessionStorage, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set');

export const ATLASSIAN_BEARER_TOKEN_KEY = 'atlassian-bearer-token';
export const ATLASSIAN_REFRESH_TOKEN_KEY = 'atlassian-refresh-token';

export const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: '__session',
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secrets: [process.env.SESSION_SECRET],
		secure: process.env.NODE_ENV === 'production',
	},
});

export async function getSession(request: Request) {
	const cookie = request.headers.get('Cookie');
	return sessionStorage.getSession(cookie);
}

export async function refresh({
	request,
	currentUrl,
}: {
	request: Request;
	currentUrl: string;
}) {
	const session = await getSession(request);
	const existingBearerToken = session.get(ATLASSIAN_BEARER_TOKEN_KEY);

	if (!existingBearerToken) {
		return;
	}

	const existingBearerTokenExpiry = getTokenExpiry(existingBearerToken);

	if (Date.now() < existingBearerTokenExpiry) {
		return;
	}

	const existingRefreshToken = session.get(ATLASSIAN_REFRESH_TOKEN_KEY);

	invariant(existingRefreshToken, 'Expected a refresh token');

	const refreshRequestBody = {
		grant_type: 'refresh_token',
		client_id: process.env.ATLASSIAN_CLIENT_ID,
		client_secret: process.env.ATLASSIAN_CLIENT_SECRET,
		refresh_token: existingRefreshToken,
	};

	const { access_token: newBearerToken, refresh_token: newRefreshToken } =
		await fetch('https://auth.atlassian.com/oauth/token', {
			method: 'POST',
			body: JSON.stringify(refreshRequestBody),
			headers: { 'Content-Type': 'application/json' },
		}).then((res) => res.json());

	session.set(ATLASSIAN_BEARER_TOKEN_KEY, newBearerToken);
	session.set(ATLASSIAN_REFRESH_TOKEN_KEY, newRefreshToken);

	return redirect(currentUrl, {
		headers: {
			'Set-Cookie': await sessionStorage.commitSession(session, {
				maxAge: 60 * 60 * 24 * 90,
			}),
		},
	});
}

export async function getIsLoggedIn(request: Request) {
	const session = await getSession(request);
	const existingBearerToken = session.get(ATLASSIAN_BEARER_TOKEN_KEY);

	if (!existingBearerToken) {
		return false;
	}

	const expiry = getTokenExpiry(existingBearerToken);

	return Date.now() < expiry;
}

export async function getToken(request: Request) {
	const session = await getSession(request);
	const token = session.get(ATLASSIAN_BEARER_TOKEN_KEY);
	return token;
}
function getTokenExpiry(token: string) {
	const decodedToken = Buffer.from(token.split('.')[1], 'base64');
	const { exp } = JSON.parse(decodedToken.toString());
	return new Date(0).setUTCSeconds(exp);
}

export async function createUserSession({
	request,
	bearerToken,
	refreshToken,
	redirectTo = '/',
}: {
	request: Request;
	bearerToken: string;
	refreshToken: string;
	redirectTo?: string;
}) {
	const session = await getSession(request);
	session.set(ATLASSIAN_BEARER_TOKEN_KEY, bearerToken);
	session.set(ATLASSIAN_REFRESH_TOKEN_KEY, refreshToken);

	return redirect(redirectTo, {
		headers: {
			'Set-Cookie': await sessionStorage.commitSession(session, {
				maxAge: 60 * 60 * 24 * 90,
			}),
		},
	});
}

export async function logout(request: Request) {
	const session = await getSession(request);
	return redirect('/', {
		headers: {
			'Set-Cookie': await sessionStorage.destroySession(session),
		},
	});
}
