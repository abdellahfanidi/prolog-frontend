import Nav from "../admin/Nav";
import {
    Button,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    Typography
} from "@mui/material";
import {Table} from "react-bootstrap";
import React, {useState} from "react";
import axios from "axios";
import sessionStorage from "sessionstorage";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import {style,style_Tracking} from "../interfaces/Css_Modal";




function Colis(props) {
    const config = {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("token")}` // Ajouter le token dans l'en-tête d'autorisation
        }
    };


    //succes and erreur envois packages :
    const [openErreur,setopenErreur]=useState(false);
    const [openErreur2,setopenErreur2]=useState(false);
    const [openSucces,setopenSucces]=useState(false);
    const handleModalFin=()=>{
        setopenErreur2(true);
        handleCloseModal2();
        setopenErreur(false);
        setopenSucces(false);
    };

    const handleClose=()=>{
        setopenErreur2(false);
        handleCloseModal2();
        setopenErreur(false);
        setopenSucces(false);
    };
    const handleOpenSucces=()=>{
        handleCloseModal2();
        setopenErreur(false);
        setopenSucces(true);
    };
    const handleOpenErreur=()=>{
        handleCloseModal2();
        setopenErreur(true);
        setopenSucces(false);
    };


    const [openModal1,setOpenModal1]=useState(false);
    const [openModal2,setOpenModal2]=useState(false);
    const [openModal3,setOpenModal3]=useState(false);
    const [openModal4,setOpenModal4]=useState(false);
    const [reference,setReference]=useState("");
    const generateReference = () => {
        const characters = '0123456789';
        const charactersLength = characters.length;
        let randomResult = 'RFC';
        for (let i = 0; i < 10; i++) {
            randomResult = randomResult.concat(characters.charAt(Math.floor(Math.random() * charactersLength)));
        }
        setReference(randomResult);
    }

    const [ConteneurId,setConteneurId] = useState();
    const [villeDepart,setvilleDepart]=useState(false);
    const [villeArrivee,setvilleArrivee]=useState(false);
    const [fullname,setfullname]=useState(false);

    const CheckRef= () => {

        axios.get(`http://localhost:8080/api/v1/conteneur/ref/${reference}`,config)
            .then(response => {
                if(response.status===200 && !response.data.fin){
                    // Affichage du modal de validation

                    const {id,villeDepart,villeArrivee,driver} = response.data;
                    setConteneurId(id);
                    setvilleDepart(villeDepart);
                    setvilleArrivee(villeArrivee);
                    axios.get(`http://localhost:8080/api/v1/user/${driver.id}`,config)
                        .then(resp => {
                            const fullname = resp.data.fullname;
                            setfullname(fullname);
                        })
                    handleInfoContainer();
                } else {
                    handleModalFin();
                }
            })
            .catch(reason => {
                handleAddContainer();
            });


    }

    const handleAddContainer=()=>{
        setDriver([]);
        axios.get('http://localhost:8080/api/v1/user',config)
            .then(response => {
                const driv = response.data.filter(driver => driver.role === "DRIVER");
                setDrivers(driv);
            })
        generateReference();
        setvilleArrivee("");
        setvilleDepart("");
        setOpenModal3(true);
        setOpenModal4(false);
        setOpenModal2(false);
        setOpenModal1(false);
    }

    const handleInfoContainer=()=>{
        setOpenModal4(true);
        setOpenModal3(false);
        setOpenModal2(false);
        setOpenModal1(false);
    };



    const handleOpenModal1= () =>{
        setOpenModal1(true);
        setOpenModal2(false);
        setOpenModal3(false);
        setOpenModal4(false);
    }
    const handleCloseModal1 = () =>{
        setOpenModal1(false);
        setOpenModal2(false);
        setOpenModal3(false);
        setOpenModal4(false);
    }

    const handleOpenModal2= () =>{
       setOpenModal2(true);
       setOpenModal1(false);
        setOpenModal3(false);
        setOpenModal4(false);

    }
    const handleCloseModal2 = () =>{
        setOpenModal1(false);
        setOpenModal2(false);
        setOpenModal3(false);
        setOpenModal4(false);
    }

    //fetch les donnes de drivers
    const [Driver, setDriver] = useState([]);
    const [Drivers,setDrivers] = useState([]);

    //fetch les donnes de factures
    let [factures, setFactures] = useState([]);
    const [isChecked, setIsChecked] = useState(true);
   //api manager for get all factures :
    axios.get(`http://localhost:8080/api/v1/factureColis`,config)
        .then(response => {
            if(!isChecked) setFactures(response.data);
            else{
                const fact = response.data.filter(facture => facture.colis.inContainer !== true);
                setFactures(fact);
            }
        });

    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedIdsTraitement, setSelectedIdsTraitement] = useState([]);

    function handleAddToContainer(){
        if(selectedIds.length===0) {
            handleOpenModal1();
        }
        else{
            handleOpenModal2();
        }
    }
    const [idsColis,setIdsColis] = useState([]);
    const colis = selectedIdsTraitement.map(id => ({ id }));
    function HandleClickValider(){
        axios.put(
            `http://localhost:8080/api/v1/conteneur/${ConteneurId}`,
            { colis },
            config
        ).then(response => {
            if(response.status===202){
                setSelectedIds([]);
                setSelectedIdsTraitement([]);
                handleOpenSucces();
            }else handleOpenErreur();
        })

    }
    function HandleClickCreate(){
        const data = {
            "ref":reference,
            "villeDepart":villeDepart,
            "villeArrivee":villeArrivee,
            "fin":false,
            "driver":{"id":Driver.id}
        }
        axios.post(
            'http://localhost:8080/api/v1/conteneur',
            data,
            config
        ).then(response => {
            if(response.status===201){
                const ID = response.data.id;
                console.log(ID);
                axios.put(
                    `http://localhost:8080/api/v1/conteneur/${ID}`,
                    { colis },
                    config
                ).then(resp => {
                    if(resp.status===202){
                        setSelectedIds([]);
                        setSelectedIdsTraitement([]);
                        handleOpenSucces();
                    }
                })
            }
        }).catch(reason => {
            handleOpenErreur();
        })
    }



    return(
        <>
            <Nav Toggle={props.Toggle} fullname={sessionStorage.getItem("fullname")}/>
            <div className="manager">
                <h2 className="booking__title">Colis : </h2>
                <div className="input-group">
                    <div className="container search-form">
                        <input type="search" id="form1" className="form-control" placeholder="Search..."/>
                        <Button variant="contained">Search</Button>
                        <Button variant="contained" onClick={handleAddToContainer} >Add to container</Button>

                    </div>
                </div>
                <br/>
                <div style={{paddingLeft:"14px",width:"25%",borderRadius:"20px",border:"2px solid var(--primary-blue)",marginLeft:"14px",marginBottom:"14px"}}>
                    <FormGroup>
                        <FormControlLabel control={<Switch
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                            defaultChecked color="default"/>} label="Hide on-board packages" style={{color:"var(--primary-blue)"}}/>
                    </FormGroup>
                </div>

                <div>

                    <Table className="table">
                        <thead>
                        <tr>
                            <th></th>
                            <th scope="col">Tracking Number</th>
                            <th scope="col">Sender</th>
                            <th scope="col">Origin Address</th>
                            <th scope="col">Arrived Address</th>
                            <th scope="col">Weight(g)</th>
                            <th scope="col">Dim(L)</th>
                            <th scope="col">Fragile</th>
                            <th scope="col">Cold</th>

                        </tr>
                        </thead>

                        <tbody>
                        {  factures?.map((item, i) => (
                            <tr key={i}>
                                <th>
                                    <div className="form-check" >
                                        <input
                                            type="checkbox"
                                            id={item.colis.trackingNumber.trackingNumber}
                                            checked={selectedIds.includes(item.colis.trackingNumber.trackingNumber)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedIds([...selectedIds, item.colis.trackingNumber.trackingNumber]);
                                                    setSelectedIdsTraitement([...selectedIdsTraitement, item.colis.id]);
                                                } else {
                                                    setSelectedIds(selectedIds.filter((id) => id !== item.colis.trackingNumber.trackingNumber));
                                                    setSelectedIdsTraitement(selectedIdsTraitement.filter((id) => id !== item.colis.id));
                                                }
                                            }}
                                        />
                                    </div>
                                </th >
                                <th scope="row" className='pl-5'>{item.colis.trackingNumber.trackingNumber}</th>
                                <td>{item.client.fullname}</td>
                                <td style={{textAlign:"left"}}>{item.colis.adresse}</td>
                                <td style={{textAlign:"left"}}>{item.colis.destinataire.adresse}</td>
                                <td>{item.colis.poids}</td>
                                <td>{item.colis.longueur * item.colis.largeur * item.colis.hauteur/1000}</td>
                                <td>{item.colis.fragile ?
                                    <i className="bi bi-box-fill " style={{color: "var(--color-font-hover)", paddingTop:'5px',paddingLeft: "12px"}}/> :
                                    <i className="bi bi-box-fill "
                                       style={{color: "var(--color-font)", paddingLeft: "12px"}}/>}</td>
                                <td>{item.colis.froid ?
                                    <i className="bi bi-box-fill " style={{color: "var(--color-font-hover)", paddingTop:'5px',paddingLeft: "12px"}}/> :
                                    <i className="bi bi-box-fill "
                                       style={{color: "var(--color-font)", paddingLeft: "12px"}}/>}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </div>

            <Modal open={openErreur2} onClose={handleClose} >
                <Box sx={style}>
                    <Grid  sx={{ my: 1 }}>
                        <Typography variant="h6" textAlign="center" gutterBottom>
                            Ce conteneur est déja arrivé à destination
                        </Typography>
                        <Button onClick={handleClose} style={{
                            backgroundColor: "var(--primary-blue)",
                            color: "black",
                            marginLeft: "180px",
                            marginTop: "27px",
                            padding: "10px"
                        }}>Ok</Button>
                    </Grid>
                </Box>
            </Modal>

            <Modal open={openErreur} onClose={handleClose} >
                <Box sx={style}>
                    <Grid  sx={{ my: 1 }}>
                        <Typography variant="h6" textAlign="center" gutterBottom>
                            Erreur d'envoie les packages !
                        </Typography>
                        <Button onClick={handleClose} style={{
                            backgroundColor: "var(--primary-blue)",
                            color: "black",
                            marginLeft: "180px",
                            marginTop: "27px",
                            padding: "10px"
                        }}>Ok</Button>
                    </Grid>
                </Box>
            </Modal>


            <Modal open={openSucces} onClose={handleClose} >
                <Box sx={style}>
                    <Grid  sx={{ my: 1 }}>
                        <Typography variant="h6" textAlign="center" gutterBottom>
                            Packages Sent Successfully!
                        </Typography>
                        <Button onClick={handleClose} style={{
                            backgroundColor: "var(--primary-blue)",
                            color: "black",
                            marginLeft: "180px",
                            marginTop: "27px",
                            padding: "10px"
                        }}>Ok</Button>
                    </Grid>
                </Box>
            </Modal>


            <Modal open={openModal1} onClose={handleCloseModal1} >
                <Box sx={style}>
                    <Grid  sx={{ my: 1 }}>
                        <Typography variant="h6" textAlign="center" gutterBottom>
                            Please Select At Least One Package!
                        </Typography>
                        <Button onClick={handleCloseModal1} style={{
                            backgroundColor: "var(--primary-blue)",
                            color: "black",
                            marginLeft: "180px",
                            marginTop: "27px",
                            padding: "10px"
                        }}>Ok</Button>
                    </Grid>
                </Box>
            </Modal>

            <Modal open={openModal2} onClose={handleCloseModal2} >
                <Box sx={style} >
                    <Grid>
                        <Typography variant="h6"  gutterBottom>
                            Container :
                        </Typography>

                        <Grid sx={{ my: 0.5 }} item xs={12} >
                            <TextField sx={{ my: 1 }}
                                       label="Reference"
                                       onChange={(e) => setReference(e.target.value)}
                                       value={reference}
                                       fullWidth
                                       type="text"
                            />
                            <Button onClick={CheckRef} style={{
                                backgroundColor: "var(--primary-blue)",
                                color: "black",
                                width:"100%"
                            }}>Check Reference</Button>
                        </Grid>
                    </Grid>
                    <Grid  sx={{ my: 1 }}>
                        <Typography variant="h6" textAlign="left" gutterBottom>
                            Packages to add to container:
                        </Typography>
                        <Grid style={style_Tracking}>
                            {selectedIds.map(item => (
                                <TextField
                                    sx={{ my: 0.1 }}
                                    style={{textAlign:"center"}}
                                    key={item.id}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    value={item}
                                    fullWidth
                                    type="text"

                                />
                            ))}
                        </Grid>
                    </Grid>
                </Box>
            </Modal>



            <Modal open={openModal3} onClose={handleOpenModal2} >
                <Box sx={style} >
                    <Grid>
                        <Typography variant="h6"  gutterBottom>
                           Add a Container :
                        </Typography>

                        <Grid sx={{ my: 0.5 }} item xs={12} >
                            <TextField sx={{ my: 1 }}
                                       label="New Reference"
                                       InputProps={{
                                           readOnly: true,
                                       }}
                                       onChange={(e) => setReference(e.target.value)}
                                       value={reference}
                                       fullWidth
                                       type="text"
                            />
                            <TextField sx={{ my: 1 }}
                                       label="Start City"
                                       onChange={(e) => setvilleDepart(e.target.value)}
                                       value={villeDepart}
                                       fullWidth
                                       type="text"
                                       required
                            />
                            <TextField sx={{ my: 1 }}
                                       label="Arrived City"
                                       onChange={(e) => setvilleArrivee(e.target.value)}
                                       value={villeArrivee}
                                       fullWidth
                                       type="text"
                                       required
                            />
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Driver</InputLabel>
                                    <Select
                                        value={Driver.fullname}
                                        label="Driver"
                                        onChange={(e) => {
                                            setDriver(e.target.value);
                                        }}
                                        required
                                    >
                                        {/*<MenuItem value={DriverObject} disabled>cc</MenuItem>*/}
                                        { Drivers.map( (item) => (
                                            <MenuItem key={item.id} value={item}>{item.fullname}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                        </Grid>
                    </Grid>
                    <Grid  sx={{ my: 1 }}>
                        <Typography variant="h6" textAlign="left" gutterBottom>
                            Packages to add to container:
                        </Typography>
                        <Grid style={style_Tracking}>
                            {selectedIds.map(item => (
                                <TextField
                                    sx={{ my: 0.1 }}
                                    style={{textAlign:"center"}}
                                    key={item.id}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    value={item}
                                    fullWidth
                                    type="text"

                                />
                            ))}
                        </Grid>
                    </Grid>
                    <Button
                        onClick={HandleClickCreate}
                        style={{
                        marginTop:"10px",
                        backgroundColor: "var(--primary-blue)",
                        color: "black",
                        width:"100%"
                    }}>Valider</Button>
                </Box>
            </Modal>



            <Modal open={openModal4} onClose={handleOpenModal2} >
                <Box sx={style} style={{overflow:"auto"}} >
                    <Grid>
                        <Typography variant="h6"  gutterBottom>
                            Informations about Container :
                        </Typography>

                        <Grid sx={{ my: 0.5 }} item xs={12} >
                            <TextField sx={{ my: 1 }}
                                       InputProps={{
                                           readOnly: true,
                                       }}
                                       label="Reference"
                                       onChange={(e) => setReference(e.target.value)}
                                       value={reference}
                                       fullWidth
                                       type="text"
                            />
                            <TextField sx={{ my: 1 }}
                                       InputProps={{
                                           readOnly: true,
                                       }}
                                       label="Start City :"
                                       value={villeDepart}
                                       fullWidth
                                       type="text"
                            />
                            <TextField sx={{ my: 1 }}
                                       InputProps={{
                                           readOnly: true,
                                       }}
                                       label="Arrived City :"
                                       value={villeArrivee}
                                       fullWidth
                                       type="text"
                            />
                            <TextField sx={{ my: 1 }}
                                       InputProps={{
                                           readOnly: true,
                                       }}
                                       label="Driver :"
                                       value={fullname}
                                       fullWidth
                                       type="text"
                            />
                        </Grid>
                    </Grid>
                    <Grid  sx={{ my: 1 }} >
                        <Typography variant="h6" textAlign="left" gutterBottom>
                            Packages to add to container:
                        </Typography>
                        <Grid style={style_Tracking}>
                            {selectedIds.map(item => (
                                <TextField
                                    sx={{ my: 0.1 }}
                                    style={{textAlign:"center"}}
                                    key={item.id}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    value={item}
                                    fullWidth
                                    type="text"
                                />
                            ))}
                        </Grid>

                    </Grid>
                    <Button
                        onClick={HandleClickValider}
                        style={{
                        marginTop:"10px",
                        backgroundColor: "var(--primary-blue)",
                        color: "black",
                        width:"100%"
                    }}>Valider</Button>
                </Box>
            </Modal>
        </>
    );

}


export default Colis;