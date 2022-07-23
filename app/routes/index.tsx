import { Link } from '@remix-run/react';
import { useAuthContext } from '~/context/AuthContext';

export default function Index() {
	const { isLoggedIn } = useAuthContext();

	return (
		<div>
			<h1>Welcome to Remix</h1>
			<Link to={isLoggedIn ? '/logout' : '/login'}>
				{isLoggedIn ? 'Logout' : 'Login'}
			</Link>
		</div>
	);
}
