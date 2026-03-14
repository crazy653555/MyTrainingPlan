import { forwardRef } from 'react';
import YouTube, { type YouTubeProps } from 'react-youtube';

interface YouTubeControllerProps {
    videoId: string | null;
    onReady: YouTubeProps['onReady'];
    isFullscreen: boolean;
}

/**
 * 封裝 YouTube 播放器邏輯與樣式
 */
export const YouTubeController = forwardRef<any, YouTubeControllerProps>(({ videoId, onReady, isFullscreen }, _ref) => {
    return (
        <div className={`w-full aspect-video ${isFullscreen ? 'h-full max-h-none' : 'max-h-[70vh]'} mx-auto overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.8)]`}>
            <YouTube
                videoId={videoId || undefined}
                opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: {
                        autoplay: 1,
                        controls: 0,
                        modestbranding: 1,
                        rel: 0,
                        showinfo: 0,
                        disablekb: 1,
                        fs: 0
                    }
                }}
                onReady={onReady}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            />
            {/* 透明遮罩，防止使用者直接點擊影片 */}
            <div className="absolute inset-0 bg-transparent z-10" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        </div>
    );
});

YouTubeController.displayName = 'YouTubeController';
