import React, { useState, useEffect, useContext } from "react";
import { Context } from "../Context";
import GetData from "../GetData";
import DocumentTitle from 'react-document-title';
import { Link } from "react-router-dom";




export default function Hosts(props) {
    const context = useContext(Context);
    const [host, setHost] = useState([])

    const param = props.match.params.id;
    
    useEffect(() => {
        GetData(`/host/${param}`)
            .then(data => setHost(data.host))
    }, [])

   

    const renderHost = () => {

        return (
            <>
                <img src={host.hostImg} alt={`Artwork or photo of ${host.hostName}`} className="host-image-detail" width="500px" height="500px" />
                <div className="host-description">
                    <h3>{host.hostName}</h3>
                    <div className="about-host">
                        <q>{host.description}</q>
                    </div>
                    <div className="social-media-container">
                        {host.youtube === "" ? null : <a href={host.youtube} target="_blank" rel="noopener noreferrer" >
                            <i className="fab fa-youtube-square"></i>
                        </a>}

                        {host.soundcloud === "" ? null : <a href={host.soundcloud} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-soundcloud"></i>
                        </a>}

                        {host.mixcloud === "" ? null : <a href={host.mixcloud} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-mixcloud"></i>
                        </a>}

                        {host.facebook === "" ? null : <a href={host.facebook} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-facebook-square"></i>
                        </a>}

                        {host.instagram === "" ? null : <a href={host.instagram} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-instagram"></i>
                        </a>}

                        {host.twitter === "" ? null : <a href={host.twitter} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-twitter-square"></i>
                        </a>}

                        {host.snapchat === "" ? null : <a href={host.snapchat} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-snapchat-square"></i>
                        </a>}
                    </div>
                    <div className="host-pagelink">
                        {host.otherLink === "" ? null : <a className="link-component" href={host.otherLink} target="_blank" rel="noopener noreferrer">
                        {host.otherName}
                        </a>}
                    </div>
                </div>
            </>
        )
    }
    return (
        <DocumentTitle title={`${host.hostName}`}>
            <div className="hosts">
                <div className={`${context.gapClass} host-page`}>
                    <h2>hosts.</h2>
                    <Link className="link-component" to={`/hosts`}>back to hosts</Link>
                    <div className="host-content">
                        <div className="host-card">
                            {renderHost()}
                        </div>
                    </div>
                </div>
            </div>
        </DocumentTitle>
    )
}

