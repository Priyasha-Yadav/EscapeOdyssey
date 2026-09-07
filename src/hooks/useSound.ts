import { sound } from '../utils/sound';

export function useSound() {
  return {
    playClick: () => sound.playClick(),
    playPop: () => sound.playPop(),
    playFanfare: () => sound.playFanfare(),
    playWhoosh: () => sound.playWhoosh(),
    playChime: () => sound.playChime(),
  };
}
