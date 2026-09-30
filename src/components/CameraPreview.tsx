import './CameraPreview.css';
import { useRef, useEffect, useState } from 'react';
import { Camera } from '../camera/camera';
import { HandTracker } from '../tracking/handTracker';
import { drawFrame } from '../helper/drawHands';
import { GestureEngine } from '../gestures/gestureEngine';
import { gestureToBinary } from '../helper/gestureToBinary';

export function CameraPreview() {
    const cameraRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const camera = useRef(new Camera()).current;
    const tracker = useRef(new HandTracker()).current;
    const gestureEngine = useRef(new GestureEngine()).current;

    const animationFrame = useRef<number | null>(null);

    const [cameraVisible, setCameraVisible] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [binary, setBinary] = useState("");

    useEffect(() => {
        return () => {
            if (animationFrame.current !== null) {
                cancelAnimationFrame(animationFrame.current);
            }

            camera.stop();

            if (cameraRef.current) {
                cameraRef.current.srcObject = null;
            }
        };
    }, [camera]);

    function startDetectionLoop() {
        if (animationFrame.current !== null) return;

        const detect = () => {
            const video = cameraRef.current;

            if (video && video.readyState >= 2) {
                const detected = tracker.detect(video);
                const gesture = gestureEngine.update(detected);
                const canvas = canvasRef.current;

                if (canvas) drawFrame(canvas, detected, gesture);

                setBinary(gestureToBinary(gesture));
            }

            animationFrame.current = requestAnimationFrame(detect);
        };

        detect();
    }

    async function startCameraStream() {
        setPermissionDenied(false);

        try {
            await tracker.initialize();
            await camera.start();

            const video = cameraRef.current;
            if (!video) return;

            video.srcObject = camera.stream;
            await video.play();

            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            }

            setCameraVisible(true);
            startDetectionLoop();
        } catch (error) {
            setPermissionDenied(true);
            console.error('Unable to start camera:', error);
        }
    }

    return (
        <>
            {!cameraVisible && (
                <div className="camera-access">
                    <button
                        className="camera-button"
                        type="button"
                        onClick={startCameraStream}
                    >
                        Request Camera Access
                    </button>

                    {permissionDenied && (
                        <p className="permission-message">
                            Camera permission was not granted. Allow camera access and try again.
                        </p>
                    )}
                </div>
            )}

            <div className="camera-container">
                <video ref={cameraRef} autoPlay playsInline />
                <canvas ref={canvasRef} />

                {cameraVisible && (
                    <div className="binary-overlay">
                        {binary.length === 0 ? (
                            <div className="no-value">
                                Use your hands to represent a binary number
                            </div>
                        ) : (
                            <>
                                <div className="binary-value">{binary}</div>
                                <div className="integer-value">
                                    {Number.parseInt(binary, 2)}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}