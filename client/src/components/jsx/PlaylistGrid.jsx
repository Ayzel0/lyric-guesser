import '../styles/PlaylistGrid.css'

const PlaylistGrid = ({ playlists }) => (
  <>
    {playlists && playlists.length ? (
      <>
        <h1 className='playlists-header'>Your Top Playlists:</h1>
        <ul className='playlist-grid'>
          {playlists.map((playlist, i) => (
            <li className='grid-item' key={i}>
              <div className='grid-item-inner'>
                {playlist.images[0] && (
                  <div className='grid-item-image'>
                    <img src={playlist.images[0].url} alt={playlist.name} />
                  </div>
                )}
                <h3 className='grid-item-title'>{playlist.name}</h3>
              </div>
            </li>
          ))}
        </ul>
      </>
    ) : (
      <h1>No Playlists Found</h1>
    )}  
  </>
)

export default PlaylistGrid;