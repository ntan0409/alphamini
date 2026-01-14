import {  useMutation } from "@tanstack/react-query";
import {  AudioConvertRequest, AudioConvertResponse } from "@/types/music";
import { convertAudioToWav } from "../api/music-api";

export const useMusic = () => {
    
    // Convert audio to WAV mutation
    const useConvertAudio = () => {
        return useMutation<AudioConvertResponse, Error, AudioConvertRequest>({
            mutationFn: convertAudioToWav,
            // Note: We don't invalidate musics cache here as this is just conversion,
            // not creating/updating music records
        });
    };

    return {
        useConvertAudio,
    };
};