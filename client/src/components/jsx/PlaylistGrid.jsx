import '../styles/PlaylistGrid.css'

const PlaylistGrid = ({ playlists }) => (
  <>
    {playlists && playlists.length ? (
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
    ) : (
      <h1>bye</h1>
    )}  
  </>
)

export default PlaylistGrid;