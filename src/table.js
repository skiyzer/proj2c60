import './App.js';
import Tablerow from './tablerow.js';

function table(props)
{
    return(
        <table>
            <Tablerow grants={props.grant}></Tablerow>
            <tbody>
                
            </tbody>
        </table>

    )
    
}


export default table