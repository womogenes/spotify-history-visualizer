import { json } from '@sveltejs/kit';
import { SPOTIFY_API_TOKEN } from '../spotifyApi';

export async function GET({ url, setHeaders, request }) {
  const search = url.searchParams.get('search') || '';

  console.log('api_token:', SPOTIFY_API_TOKEN);

  setHeaders({
    'cache-control': 'max-age=3600'
  });

  return json({});
}
