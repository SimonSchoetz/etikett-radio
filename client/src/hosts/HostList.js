import React, { useState, useEffect, useContext, Fragment } from 'react'
import { Context } from "../Context";
import GetData from "../GetData";
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router-dom';

export default function HostList() {
    const context = useContext(Context);
    const [hostData, setHostData] = useState([])

    useEffect(() => {
        GetData("/host")
            .then(data => setHostData(data.host.filter(host => host.isActive === "active").sort((hostA, hostB) => (hostA.hostName < hostB.hostName) ? -1 : 1)))
    }, [])

    const renderHost = () => {
        if (hostData.length === 0) return null

        return hostData.map((host, i) => (
            <Fragment key={i}>
                <li className="hosts-list-item">
                    <Link className="link-component" to={`hosts/${host._id}`} param={host._id} >
                    
                        <div className="host-image-borders">
                            <h3 className="host-name">{host.hostName}.</h3>
                            <img src={host.hostImg} alt={`Artwork or photo of ${host.hostName}`} className="host-images" width="400px" height="400px" />
                        </div>
                    </Link>
                </li>
            </Fragment>
        ))
    }

    return (
        <DocumentTitle title="Hosts">
            <div className={`${context.gapClass} host-list-container`}>
                <h2 id="hosts-title">hosts.</h2>
                <div className="grid-wrapper">
                    <div className=" hosts-list">
                        {renderHost()}
                    </div>
                </div>
            </div>
        </DocumentTitle>
    )
}
