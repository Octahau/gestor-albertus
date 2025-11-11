"use client";

import { useEffect, useRef } from "react";
import {
  BrowserMultiFormatReader,
  NotFoundException,
  DecodeHintType,
  BarcodeFormat,
} from "@zxing/library";

interface BarcodeScannerProps {
  onScanResult: (result: string) => void;
  onError: (errorMsg: string) => void;
}

export default function BarcodeScanner({ onScanResult, onError }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      onError("Cámara no disponible o conexión no segura (HTTPS requerido).");
      return;
    }

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.CODE_128,
      BarcodeFormat.QR_CODE,
    ]);

    const reader = new BrowserMultiFormatReader(hints);
    readerRef.current = reader;
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: isMobile ? { ideal: "environment" } : undefined,
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        // focusMode cannot be specified in MediaTrackConstraints typings;
        // we'll try to enable it later via track.applyConstraints when supported.
      },
      audio: false,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(async (stream) => {
        streamRef.current = stream;
        videoElement.srcObject = stream;

        // 🔍 Intentar mejorar el enfoque (si la cámara lo soporta)
        const [track] = stream.getVideoTracks();
        const capabilities = track.getCapabilities?.() as any;
        if (capabilities && (capabilities.focusMode || capabilities.zoom)) {
          try {
            const advancedConstraints: any[] = [];
            if (capabilities.focusMode) {
              advancedConstraints.push({ focusMode: "continuous" } as any);
            }
            if (capabilities.zoom) {
              advancedConstraints.push({ zoom: capabilities.zoom.max } as any);
            }
            if (advancedConstraints.length > 0) {
              await track.applyConstraints({
                advanced: advancedConstraints,
              } as any);
              console.log("🔧 Enfoque automático habilitado.");
            }
          } catch {
            console.warn("⚠️ No se pudo aplicar enfoque automático.");
          }
        }

        // Esperar hasta que el video pueda reproducirse
        videoElement.onloadedmetadata = async () => {
          try {
            await videoElement.play();
            console.log("🎥 Video reproduciéndose correctamente");

            reader.decodeFromStream(stream, videoElement, (result, err) => {
              if (result) {
                console.log("✅ Código detectado:", result.getText());
                onScanResult(result.getText());
              } else if (err && !(err instanceof NotFoundException)) {
                console.error("Error de lectura:", err);
                onError(err.message);
              }
            });
          } catch (e: any) {
            console.warn("⚠️ No se pudo reproducir el video:", e.message);
            onError("No se pudo reproducir el video. Verifica permisos o cámara.");
          }
        };
      })
      .catch((err) => {
        console.error("Error al acceder a la cámara:", err);
        const message =
          err.name === "NotAllowedError"
            ? "Permiso denegado para usar la cámara."
            : err.name === "NotFoundError"
            ? "No se encontró ninguna cámara disponible."
            : `Error al acceder a la cámara: ${err.message}`;
        onError(message);
      });

    return () => {
      console.log("🧹 Limpiando cámara y lector...");
      readerRef.current?.reset();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoElement) {
        videoElement.pause();
        videoElement.srcObject = null;
      }
    };
  }, [onScanResult, onError]);

  return (
    <div className="w-full max-w-md mx-auto">
      <video
        ref={videoRef}
        muted
        playsInline
        autoPlay
        style={{
          width: "100%",
          borderRadius: "8px",
          border: "1px solid gray",
          backgroundColor: "#000",
          display: "block",
        }}
      />
    </div>
  );
}
