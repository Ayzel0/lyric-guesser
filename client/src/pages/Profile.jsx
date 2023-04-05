import { useState, useEffect } from 'react'
import { getCurrentUserProfile } from '../spotify';

/**
 * function to fetch user profile data. Imports the getCurrentUserProfile func from spotify.
 */
const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await getCurrentUserProfile();
      setProfile(userProfile.data);
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