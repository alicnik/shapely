import { getToken } from './session.server';

export async function getIssue(request: Request) {
	const token = await getToken(request);
	const data = await fetch(
		'https://api.atlassian.com/ex/jira/388791b1-0110-4499-9b9a-86f42a01bed7/rest/api/2/issue/TP-1',
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	).then((res) => res.json());
	return data;
}
