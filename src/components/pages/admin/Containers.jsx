// import sessionStorage from "sessionstorage";
// import Nav from "./Nav";
// import * as React from "react";
// import Button from "@mui/material/Button";
// import {Table} from "react-bootstrap";
// import Stack from "@mui/material/Stack";
// import UpdateIcon from "@mui/icons-material/Update";
// import DeleteIcon from "@mui/icons-material/Delete";
// import {useState} from "react";
// import axios from "axios";
//
//
// const Containers=(props)=>{
//     const config = {
//         headers: {
//             'Authorization': `Bearer ${sessionStorage.getItem("token")}` // Ajouter le token dans l'en-tête d'autorisation
//         }
//     };
//
//
//     const [Containers, setContainers] = useState([]);
//     const [selectedContainer, setSelectedContainer] = useState(null);
//
// // get all containers :
//     try{
//         axios.get('http://localhost:8080/api/v1/conteneur',config)
//             .then(response => {
//                 if(response.status === 200){
//                     setContainers(response.data);
//                 }else console.log("ereur"+response.status);
//             })
//     }catch (error){
//         console.log(error);
//     }
//
//     const handleRowClick = (container) => {
//         setSelectedContainer(container);
//     };
//     return(
//         <>
//             <Nav Toggle={props.Toggle} fullname={sessionStorage.getItem("fullname")}/>
//             <div className="manager">
//                 <h2 className="title">Containers : </h2>
//
//
//                 <div className="input-group">
//                     <div className="container search-form">
//                         <input type="search" id="form1" className="form-control" placeholder="Search..."/>
//                         <Button variant="contained" >Search</Button>
//                     </div>
//                 </div>
//                 <br/>
//                 <div>
//
//                     <Table className="table table-manager" >
//                         <thead>
//                         <tr >
//                             <th scope="col">Reference</th>
//                             <th scope="col">Nombre de colis</th>
//                             <th scope="col">Trajet</th>
//                             <th scope="col">Driver</th>
//                             <th scope="col">Status</th>
//
//                         </tr>
//                         </thead>
//                         <tbody>
//
//                         {Containers?.map((container, i) => (
//                             <React.Fragment key={i}>
//                                 <tr onClick={() => handleRowClick(container)}>
//                                     <td scope="row" className='pl-5'>{container.ref}</td>
//                                     <td>{container.colis.length}</td>
//                                     <td>{container.villeDepart} to {container.villeArrivee}</td>
//                                     <td>{container.driver.fullname}</td>
//                                     <td>{container.fin?"Arrivé":"En cours"}</td>
//                                 </tr>
//                                 {selectedContainer && selectedContainer.id === container.id && (
//                                     <tr key={`${i}-details`} style={{backgroundColor:"var(--color-menu-hover)"}}>
//                                         <td colSpan={5}>
//                                             <table className="table-table" >
//                                                 <tbody>
//                                                 <tr>
//                                                     <th>Tracking Number</th>
//                                                     <th>Adresse Source</th>
//                                                     <th>Adresse Destinataire</th>
//                                                     <th>Livré</th>
//                                                 </tr>
//                                                 {selectedContainer.colis.map((item, j) => (
//                                                     <tr key={`${i}-${j}`}>
//                                                         <td>{item.trackingNumber.trackingNumber}</td>
//                                                         <td>{item.adresse}</td>
//                                                         <td>{item.destinataire.adresse}</td>
//                                                         <td>{item.delivered?"Délivré":"Non"}</td>
//                                                     </tr>
//                                                 ))}
//                                                 </tbody>
//                                             </table>
//                                         </td>
//                                     </tr>
//                                 )}
//                             </React.Fragment>
//                         ))}
//
//
//                         </tbody>
//                     </Table>
//                 </div>
//             </div>
//         </>
//     );
// }
//
//
// export  default Containers;