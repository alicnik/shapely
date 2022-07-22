import { Link } from '@mui/material';

export default function Index() {
	return (
		<div>
			<h1>Welcome to Remix</h1>
			<Link
				href={`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=UfRiTYzPz0SXCMpQm6i0TWFFbvqtFR1P&scope=read%3Ajira-user%20read%3Ajira-work&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback&state=random&response_type=code&prompt=consent`}
			>
				Login
			</Link>
		</div>
	);
}
