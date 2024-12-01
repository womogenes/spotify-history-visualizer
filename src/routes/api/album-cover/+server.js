import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { json } from '@sveltejs/kit';

// Get API token from Spotify
const api_token = (
  await (
    await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET
      })
    })
  ).json()
).access_token;

export async function GET({ url, setHeaders, request }) {
  const search = url.searchParams.get('search') || '';

  console.log('api_token:', api_token);

  setHeaders({
    'cache-control': 'max-age=3600'
  });

  return json({});
}
