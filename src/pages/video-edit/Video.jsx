import React from 'react';
import {Composition, Sequence, Audio, staticFile} from 'remotion';
import storyboard from './Storyboard.json';
import {Scene} from './scenes/Scene';

export const Video = () => {
  const fps = 30;
  const width = 1080;
  const height = 1920;

  const totalDuration = storyboard.video.scenes.reduce(
    (sum, s) => sum + s.duration * fps,
    0
  );

  return (
    <Composition
      id="FoodBuddyVideo"
      component={() => (
        <>
          {/* Background Music Across Whole Video */}
          <Audio
            src={staticFile('assets/bg-music.wav')}
            volume={() => 0.15}
          />

          {/* Scenes */}
          {storyboard.video.scenes.map((scene, idx) => {
            const from = storyboard.video.scenes
              .slice(0, idx)
              .reduce((sum, s) => sum + s.duration * fps, 0);

            return (
              <Sequence
                key={scene.id}
                from={from}
                durationInFrames={scene.duration * fps}
              >
                <Scene {...scene} fps={fps} />
              </Sequence>
            );
          })}
        </>
      )}
      durationInFrames={totalDuration}
      fps={fps}
      width={width}
      height={height}
    />
  );
};
