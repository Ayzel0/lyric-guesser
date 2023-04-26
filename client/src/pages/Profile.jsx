import { useState, useEffect } from 'react'
import { getCurrentUserProfile, getCurrentUserPlaylists } from '../spotify';
import PlaylistGrid from '../components/jsx/PlaylistGrid';
import ProfileBar from '../components/jsx/ProfileBar';

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
      <>
      {profile && (
        <>
          <ProfileBar profile = {profile} />
        </>
      )}
      </>
      <>
      {playlists && (
        <>
          <PlaylistGrid playlists = {playlists.items.slice(0, 10)} />
        </>
      )}
      </>
    </>
  )
}

export default Profile;