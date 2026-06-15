import '../estilos/navBar.css'
function navBar(){
    return(
        <div className="navBarGrid">
            <div className="imgIconBar">
                <img src=".\src\assets\icon.jpg"></img>
            </div>
            <div className="textDiv">
                <h2>Bitácoras</h2>
            </div>
            <div className="iconSesion">
                <button>X</button>
            </div>
        </div>
    )
}
export default navBar