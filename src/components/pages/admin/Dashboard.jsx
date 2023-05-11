import  Nav from "./Nav";
import React from "react";
import "../css/dashboard.css";

function Dashboard(props){
    return(

        <>
            <Nav Toggle={props.Toggle} fullname={sessionStorage.getItem("fullname")}/>
          <div className="container-fluid px-lg-4">
           <div className="row g-3 my-2 ">
               <div className="col-md-3 p-1">
                   <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                       <div>
                           <h3 className="fs-2">200</h3>
                           <p className="fs-2">packages</p>
                       </div>
                       <i className="bi bi-cart-plus p-3 fs-1"/>
                   </div>
               </div>
               <div className="col-md-3 p-1">
                   <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                       <div>
                           <h3 className="fs-2">200</h3>
                           <p className="fs-2">Bénéfice</p>
                       </div>
                       <i className="bi bi-currency-dollar p-3 fs-1"/>
                   </div>
               </div>
               <div className="col-md-3 p-1">
                   <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                       <div>
                           <h3 className="fs-2">200</h3>
                           <p className="fs-2">Delivery</p>
                       </div>
                       <i className="bi bi-truck p-3 fs-1"/>
                   </div>
               </div>
               <div className="col-md-3 p-1">
                   <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                       <div>
                           <h3 className="fs-2">20%</h3>
                           <p className="fs-2">Increase</p>
                       </div>
                       <i className="bi bi-graph-up-arrow p-3 fs-1"/>
                   </div>
               </div>
           </div>
          </div>
            <div className="px-4">
            <table className="table caption-top mt-2 table-dashboard">
                <caption className="text-white fs-4">Recent Orders</caption>
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">First</th>
                    <th scope="col">Last</th>
                    <th scope="col">Handle</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td colSpan="2">Larry the Bird</td>
                    <td>@twitter</td>
                </tr>
                </tbody>
            </table>
            </div>
        </>
    );
}

export default Dashboard;