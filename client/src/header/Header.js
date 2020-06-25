import React, { useState, useEffect, useRef, useContext } from 'react';
import { useAlert } from 'react-alert';
import audioIcon from '../icons/audio.png';
import muteIcon from '../icons/mute.png';
import { withRouter } from 'react-router-dom';
import ChatApp from '../chat/ChatApp';
import GetData from "../GetData";
import { Context } from "../Context";
import moment from "moment";
import ResponsiveNavbar from './ResponsiveNavbar';
import Stream from './Stream';
import DesktopNavbar from './DesktopNavbar';
import MessageControls from './MessageControls';

function Header({ location, name, setName, isMobileWidth, isMobileDevice }) {
    const context = useContext(Context)
    const alert = useAlert();
    const videoPlayer = useRef();

    // Currently not streaming example
    // const channelId = '521258416';
    // const video = 'https://www.twitch.tv/etikett_radio';

    // Currently sreaming example
    const channelId = '274901255';
    const video = 'https://www.twitch.tv/truthmusic';

    const radio = 'https://s9.myradiostream.com/44782/listen.mp3';

    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState("0.5");
    const [muted, setMuted] = useState(false);
    const [icon, setIcon] = useState(audioIcon);
    const [headerSize, setHeaderSize] = useState('');
    const [chatState, setChatState] = useState('chat-homescreen-with-video');
    const [source, setSource] = useState(radio);
    const [loading, setLoading] = useState(true);

    context.setPathName(location.pathname)

    useEffect(() => {
        const options = {
            headers: {
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Client-ID': 'gp762nuuoqcoxypju8c569th9wz7q5',
                'Authorization': 'Bearer mz2js4nc3yjfywkj04p5bhivieycjm'
            }
        }

        fetch(`https://api.twitch.tv/helix/streams?user_id=${channelId}`, options)
            .then(res => res.json())
            .then(streamData => {
                if (!streamData.data[0]) {
                    return
                }
                if (streamData.data[0].type === "live" && !isMobileDevice) {
                    setSource(video)
                }
            })
            .then(() => {
                if (source === video && location.pathname === '/') {
                    setHeaderSize('full-header');
                    setChatState('chat-homescreen-with-video');
                    context.setGapClass("big-gap");
                    // If there's no video
                } else if (source !== video) {
                    setHeaderSize('small-header-without-video');
                    setChatState('chat-routes-without-video');
                    context.setGapClass("small-gap");
                } else {
                    setHeaderSize('small-header-with-video');
                    setChatState('chat-routes-with-video');
                    context.setGapClass("big-gap");
                }
                setLoading(false);
            })

    }, [source])


    useEffect(() => {

        // If there's video and we are on homescreen
        if (source === video && location.pathname === '/') {
            setHeaderSize('full-header');
            setChatState('chat-homescreen-with-video');

            // If there's no video
        } else if (source !== video) {
            setHeaderSize('small-header-without-video');
            setChatState('chat-routes-without-video');
        } else {
            setHeaderSize('small-header-with-video');
            setChatState('chat-routes-with-video');
        }

        // I thought this would create an infinite loop, but it works ¯\_(ツ)_/¯
    }, [source, location.pathname])

    const handlePlayBtn = e => {
        e.target.classList.toggle('paused')
        setPlaying(!playing);
    }

    const handleAudio = () => {
        // Mute audio
        setMuted(!muted)

        // Change icon
        if (muted) {
            setIcon(audioIcon);
            setVolume(0.5);
        } else {
            setIcon(muteIcon);
            setVolume(0);
        }
    }

    const handleVolume = e => {
        setVolume(e.target.value);
        if (parseFloat(volume) < 0.15) {
            setMuted(true);
            setIcon(muteIcon);
        } else {
            setMuted(false);
            setIcon(audioIcon);
        }
    }

    ////////////////
    //For InfoBar
    ////////////////
    useEffect(() => {
        GetData("/infobar")
            .then(data => {
                if (!data.success) alert.error("Failed to fetch data, please contact an admin.");
                if (data.status === 403) {
                    alert.error("Status 403: Forbidden")
                    return
                }
                if (!data.success) {
                    alert.error("Failed to fetch data, please contact an admin")
                    return
                };
                context.setInfoBarMessage(data.infoBar[0].message)
                context.setInfoID(data.infoBar[0]._id)
            })
    }, [])

    ////////////////
    //Clock 
    ////////////////
    const [time, setTime] = useState(moment().format("h:mm:ss a"))
    const timer = () => setTime(moment().format("H:mm:ss"))
    useEffect(
        () => {

            const id = setInterval(timer, 1000);
            return () => clearInterval(id);
        }, [time]);

    return (
        loading
            ? ( null ) : (
                <header className={`App-header ${headerSize}`}>

                    {isMobileWidth ? <ResponsiveNavbar /> : <DesktopNavbar /> }

                        <div className={`chat ${chatState}`}> <ChatApp name={name} setName={setName} /> </div>

                        <Stream source={source} playing={playing} volume={volume} videoPlayer={videoPlayer} />

                        <MessageControls 
                            source={source} 
                            radio={radio} 
                            icon={icon} 
                            volume={volume} 
                            handlePlayBtn={handlePlayBtn} 
                            handleAudio={handleAudio} 
                            handleVolume={handleVolume}
                            time={time}
                        />
                </header>
            )
    )
}

export default withRouter(Header);