
import { makeStyles } from '@material-ui/core/styles';
export default makeStyles((theme) => ({
    Delete:{
        color:'red',
        backgroundColor:'lightgrey',
        marginLeft:'-30px'
    },
    Update:{
        color:'blue',
        backgroundColor: 'lightgrey',
        marginLeft:'-10px'
    },
    resolved: {
        backgroundColor: 'success'
    },
    noStyle: {
        backgroundColor: 'red'
    },
    searchContainer: {
        display: 'flex',
        justifyContent: 'flexStart',
        alignItems: 'center'
    }
    
    
}));