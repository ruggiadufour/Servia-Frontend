import { makeStyles } from '@material-ui/core/styles';
//Componente que contiene todos los estilos que se utilizan en la página
const Estilos = makeStyles((theme) => ({
    mostrarFlex: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: 10,
    },
    fondo:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: 10, 
        minHeight:"calc(100vh - 130px)",
    },
    proveedorSticky:{
        display: 'scroll',
        position: 'sticky',
        top: 10,
        flexWrap: 'wrap',
        marginBottom: 10,
        marginTop:10
    },
    margenArriba:{
        marginTop: 10,
    },
    padding:{
        padding: 20
    },
    padding2:{
        padding: 10
    },
    filaPublicacion:{
        padding: 10,
        marginTop: 10,
        background: "rgba(214, 215, 204, 100)"
    },
    imagenPublicacion:{
        borderRadius: "6px",
        objectFit: "cover",
        border: "1px solid #000",
        width: 170,
        height: 170,
        margin: "auto",
        marginBottom: 15,
        marginTop: 15
    },
    gridRegistro:{
        maxWidth:550, 
        padding: 20,
        marginBottom: 10,
    },
    inputAncho:{
        width: "100%",
    },
    papelFondo:{
        border: '1px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        backgroundColor: "#d7d6d9"//theme.palette.secondary.dark
    },
    pantallaMedia:{
        maxWidth: 800, 
        minWidth: 360,
    },
    botonFijo: {
        display: "scroll",
        position: "fixed",
        left: "50%",
        top: "calc(100% - 80px)",
        transform: "translate(-50%, -50%)",
        zIndex: 100
    },
    button:{
        textTransform: "none"
    },
    margenAuto:{
        margin: "auto"
    },
    reporte:{
        padding: 10,
        marginTop: 10,
    },
    botonesNav:{
        textDecoration:"none",
        color: theme.palette.secondary.main,
        display: 'inline',
        '@media (max-width:1075px)': {
          display: 'none',
        },
    },
    EstiloMovil:{
        display: 'none',
        '@media (max-width:1075px)': {
            display: 'inline',
        },
    },
    EstiloPC:{
    display: 'inline',
    '@media (max-width:1075px)': {
        display: 'none',
    },
    },
    EstiloLink:{
        textDecoration:"none",
        color: theme.palette.secondary.contrastText
    },
    EstiloVacio:{
        
    },
    Categoria: {
        width:100,
        height:100,
        padding:0,
        margin:"auto",
        paddingTop:20
    },
    BotonSolicitar:{
        display: 'inline',
        '@media (max-width:1075px)': {
            display: 'none',
        },
        position: "absolute",
        left: "90%",
        top: "35px",
        transform: "translate(-70%, -50%)",
        zIndex: 1000,
        width: "195px",
    },
    BotonSolicitarMovil:{
        display: 'none',
        '@media (max-width:1075px)': {
            display: 'inline',
        },
        position: "absolute",
        left: "90%",
        top: "35px",
        transform: "translate(-70%, -50%)",
        zIndex: 1000,
    },
    
}));

export default Estilos;