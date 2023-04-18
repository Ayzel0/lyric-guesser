import { useState, useEffect } from 'react'
import { getCurrentUserProfile, getCurrentUserPlaylists } from '../spotify';

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
      {profile && (
        <h1>you have {profile.followers.total} followers</h1>
      )}
    </>
  )
}

export default Profile;