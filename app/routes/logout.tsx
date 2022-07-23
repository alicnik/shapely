import type { LoaderFunction } from '@remix-run/node';
import { logout } from '~/utils';

export const loader: LoaderFunction = async ({ request }) => {
	return logout(request);
};
