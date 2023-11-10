// App.jsx
import React, { useState, useEffect, useRef } from "react";

import "./App.scss";

import ReactLogo from "./assets/Logo.svg";
import Background from "./assets/BackgroundImage.jpg";
import PauseSvg from "./assets/pause-stream.svg";
import RewindNextSvg from "./assets/rewind-next.svg";
import RewindPrevSvg from "./assets/rewind-prev.svg";
import VolumeCrossSVG from "./assets/volume-cross.svg";
import VolumeloudSvg from "./assets/volume-loud.svg";

const tracks = [
  {
    title: "Track 1",
    source: "url_to_track_1.mp3",
    cover: "url_to_cover_image_1.jpg",
  },
  {
    title: "Track 2",
    source: "url_to_track_2.mp3",
    cover: "url_to_cover_image_2.jpg",
  },
  // ... добавьте другие треки по желанию
];

const App = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const audioRef = useRef(new Audio(tracks[currentTrackIndex].source));
  const intervalRef = useRef();

  const startRotation = () => {
    intervalRef.current = setInterval(() => {
      const image = document.getElementById("cover-image");
      image.style.transform += "rotate(1deg)";
    }, 50);
  };

  const stopRotation = () => {
    clearInterval(intervalRef.current);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      stopRotation();
    } else {
      audio.play();
      startRotation();
    }
    setIsPlaying(!isPlaying);
  };

  const changeVolume = (e) => {
    const newVolume = e.target.value;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const changeTrack = (step) => {
    setCurrentTrackIndex((prevIndex) => {
      let index = prevIndex + step;
      if (index < 0) {
        index = tracks.length - 1;
      } else if (index >= tracks.length) {
        index = 0;
      }
      return index;
    });
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = tracks[currentTrackIndex].source;
    if (isPlaying) {
      audio.play();
    }
    return () => {
      audio.pause();
      stopRotation();
    };
  }, [currentTrackIndex]);

  return (
    <div className="audio-player">














	
      {/* <img
				id='cover-image'
				src={tracks[currentTrackIndex].cover}
				alt={tracks[currentTrackIndex].title}
				className={`cover ${isPlaying ? 'rotating' : ''}`}
			/> */}
      <button onClick={() => changeTrack(-1)}><RewindPrevSvg/></button>
      <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
      <button onClick={() => changeTrack(1)}>Next</button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={changeVolume}
      />
      <div>{tracks[currentTrackIndex].title}</div>
    </div>
  );
};

export default App;
