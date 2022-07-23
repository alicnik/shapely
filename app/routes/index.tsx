import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { useAuthContext } from '~/context/AuthContext';
import { getIssue } from '~/utils/jira.server';

export const loader: LoaderFunction = async ({ request }) => {
	const data = await getIssue(request);
	return json(data);
};

export default function Index() {
	const { isLoggedIn } = useAuthContext();
	const data = useLoaderData();

	console.log(data);

	return (
		<div>
			<h1>Welcome to Remix</h1>
			<Link to={isLoggedIn ? '/logout' : '/login'}>
				{isLoggedIn ? 'Logout' : 'Login'}
			</Link>
		</div>
	);
}
