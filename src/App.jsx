// App.jsx
import React, { useState, useEffect, useRef } from 'react'
import './Normalize.css'
import './App.scss'

import {
	Logo,
	PauseStream,
	PlayStream,
	RewindNext,
	RewindPrev,
	VolumeCross,
	VolumeLoud,
} from './assets'

import { tracks } from './Track'

const App = () => {
	const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)
	const [volume, setVolume] = useState(0.75)
	const [trackProgress, setTrackProgress] = useState(0)
	const audioRef = useRef(new Audio(tracks[currentTrackIndex].source))
	const intervalRef = useRef()

	useEffect(() => {
		const audio = audioRef.current
		audio.src = tracks[currentTrackIndex].source
		setTrackProgress(0)
		if (isPlaying) audio.play()
		return () => audio.pause()
	}, [currentTrackIndex, isPlaying])

	useEffect(() => {
		const updateProgress = () => {
			setTrackProgress(audioRef.current.currentTime)
		}

		if (isPlaying) {
			intervalRef.current = setInterval(updateProgress, 1000)
		} else {
			clearInterval(intervalRef.current)
		}

		return () => clearInterval(intervalRef.current)
	}, [isPlaying])

	const togglePlay = () => {
		setIsPlaying(!isPlaying)
	}

	const changeTrack = step => {
		setCurrentTrackIndex(
			prevIndex => (prevIndex + step + tracks.length) % tracks.length
		)
	}

	const handleVolumeChange = e => {
		setVolume(e.target.value)
		audioRef.current.volume = e.target.value
	}

	const handleTrackProgressChange = e => {
		const newTime = e.target.value
		audioRef.current.currentTime = newTime
		setTrackProgress(newTime)
	}

	return (
		<div className='wrapper'>
			<div className='audio-player'>
				{/* Кнопки управления */}
				<div className='audio-player__controls'>
					<button
						className='audio-player__button'
						onClick={() => changeTrack(-1)}
					>
						<RewindNext />
					</button>
					<button className='audio-player__button' onClick={togglePlay}>
						{isPlaying ? <PlayStream /> : <PauseStream />}
					</button>
					<button
						className='audio-player__button'
						onClick={() => changeTrack(1)}
					>
						<RewindPrev />
					</button>
				</div>
				{/* Информация о треке и элементы управления */}
				<div className='audio-player__info'>
					<div className='audio-player__volume'>
						<VolumeCross />
						<input
							className='audio-player__volume-range'
							type='range'
							min='0'
							max='1'
							step='0.01'
							value={volume}
							onChange={handleVolumeChange}
						/>
						<VolumeLoud />
					</div>

					<div className='audio-player__track-title'>
						{tracks[currentTrackIndex].title}
					</div>
					<input
						className='audio-player__progress'
						type='range'
						min='0'
						max={audioRef.current.duration || 0}
						value={trackProgress}
						onChange={handleTrackProgressChange}
					/>
				</div>
				{/* Обложка трека */}
				<img
					id='cover-image'
					src={tracks[currentTrackIndex].cover}
					alt={tracks[currentTrackIndex].title}
					className={`audio-player__cover ${
						isPlaying ? 'audio-player__cover--rotating' : ''
					}`}
				/>
			</div>
		</div>
	)
}

export default App
