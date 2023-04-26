import '../styles/ProfileBar.css';

const ProfileBar = ({profile}) => {
  return (
    <>
      {profile && (
        <div className='title-display'>
          <img src={profile.images[0].url} alt={profile.display_name}/>
          <div className='profile-info'>
            <h1>{profile.display_name}</h1>
            {profile.followers.total == 1 ? (
              <h3>{profile.followers.total} Follower</h3>
            ) : (
              <h3>{profile.followers.total} Followers</h3>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ProfileBar;