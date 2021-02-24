import {useContext} from 'react'
import MuiAlert from '@material-ui/lab/Alert';
import {Snackbar, Grid} from '@material-ui/core';

import {AlertState} from '../States/Alert'

export default function PopAlert() {
    const {AState, ADispatch} = useContext(AlertState)

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        ADispatch({type:"cleanAlert"})
    };
    
    return (
       <div>
           <Grid container>
                <Snackbar open={AState.open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={AState.type}>
                        {AState.desc}
                    </Alert>
                </Snackbar>
            </Grid>
       </div>
    )
}
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}