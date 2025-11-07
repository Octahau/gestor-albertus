"use client";

import { useEffect, useRef, useState } from "react";
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

    // Solicitar acceso a la cámara
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        streamRef.current = stream;
        videoElement.srcObject = stream;

        // Necesario para reproducir automáticamente en móviles
        videoElement
          .play()
          .catch((e) => console.warn("No se pudo reproducir el video:", e));

        // Iniciar decodificación
        reader.decodeFromStream(stream, videoElement, (result, err) => {
          if (result) {
            onScanResult(result.getText());
          }
          if (err && !(err instanceof NotFoundException)) {
            onError(err.message);
          }
        });
      })
      .catch((err) => {
        console.error("Error al acceder a la cámara:", err);
        const message =
          err.name === "NotAllowedError"
            ? "El permiso para usar la cámara fue denegado."
            : `Error al acceder a la cámara: ${err.message}`;
        onError(message);
      });

    // Limpieza al desmontar el componente
    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }

      // Detener todas las pistas activas del stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

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
