import { Link } from 'react-router-dom';

export default function Erro(){
    return(
        <div> 
            <h1>Erro 404: Page not found</h1>
            <Link to={`/`}>Volte à página inicial.</Link>
        </div>
    )
}