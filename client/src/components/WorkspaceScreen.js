import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { GlobalStoreContext } from '../store/index.js'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    let ctrlPressed = false;
    document.onkeydown = handleAppKeyDown;
    document.onkeyup = handleAppKeyUp;

    function handleAppKeyDown (keyEvent) {
        let CTRL_KEY_CODE = 17;
        if (keyEvent.which === CTRL_KEY_CODE) {
            ctrlPressed = true;
        }
        else if (keyEvent.key.toLowerCase() === "z") {
            if (ctrlPressed) {
                store.undo();
            }
        }
        else if (keyEvent.key.toLowerCase() === "y") {
            if (ctrlPressed) {
                store.redo();
            }
        }
    }
    function handleAppKeyUp (keyEvent) {
        if (keyEvent.which === 17) {
            ctrlPressed = false;
        }
    }
    
    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }
    return (
        <Box>
        <List 
            id="playlist-cards" 
            sx={{ width: '100%', bgcolor: 'background.paper' }}
        >
            {
                store.currentList.songs.map((song, index) => (
                    <SongCard
                        id={'playlist-song-' + (index)}
                        key={'playlist-song-' + (index)}
                        index={index}
                        song={song}
                    />
                ))  
            }
         </List>            
         { modalJSX }
         </Box>
    )
}

export default WorkspaceScreen;