import React from "react"
import "../css/styling.css"
import maps_icon from "../assets/google-maps-icon.png"
import phone_icon from "../assets/phone-icon.png"

function GymContainer(props) {

    return (
        <div className="gym-container">
          <img src={props.imageLink}/>
          <h3>{props.location}</h3>
          <div className="address-container"><img src={maps_icon} style={{width: 50, height: 50}}/><a href={props.addressLink} target="_blank">{props.address}</a></div>
          <div className="number-container"><img src={phone_icon} style={{width: 35, height: 35}}/><span>{props.phoneNumber}</span></div>
        </div>
    )
}

export default GymContainer
