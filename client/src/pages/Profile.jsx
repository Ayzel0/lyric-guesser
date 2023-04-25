import { useState, useEffect } from 'react'
import { getCurrentUserProfile, getCurrentUserPlaylists } from '../spotify';
import PlaylistGrid from '../components/jsx/PlaylistGrid';
import LogoutButton from '../components/jsx/LogoutButton';

/**
 * function to fetch user profile data. Imports the getCurrentUserProfile func from spotify.
 */
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await getCurrentUserProfile();
      setProfile(userProfile.data);

      const userPlaylists = await getCurrentUserPlaylists();
      setPlaylists(userPlaylists.data)
    }

    fetchData();
  }, []);

  return (
    <>
      <LogoutButton />
      <>
      {profile && (
        <>
          <h1>you have {profile.followers.total} followers</h1>
        </>
      )}
      </>
      <>
      {playlists && (
        <>
          <h1>Your Top Playlists:</h1>
          <PlaylistGrid playlists = {playlists.items.slice(0, 10)} />
        </>
      )}
      </>
    </>
  )
}

export default Profile;

/* <h2>your top playlists are:</h2>
          <PlaylistGrid playlists = {playlists.items.slice(0, 10)}/> */