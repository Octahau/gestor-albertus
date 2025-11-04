"use client";

import React, { useEffect, useRef, useState } from "react";

type ScannerProps = {
  onDetected: (code: string) => void;
  formats?: string[]; // opcional: lista de formatos preferidos
  fps?: number;
  qrbox?: number | { width: number; height: number };
};

export default function Scanner({
  onDetected,
  formats = ["ean_13", "code_128", "upc_a", "qr_code"], // nombres amigables; mapearemos
  fps = 10,
  qrbox = 250,
}: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const html5QrRef = useRef<any>(null);
  const [using, setUsing] = useState<"barcode-detector" | "html5-qrcode" | null>(null);

  useEffect(() => {
    let aborted = false;
    let detector: any = null;
    let stream: MediaStream | null = null;

    const stopStream = () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        stream = null;
      }
    };

    // Helper: map friendly names to BarcodeDetector format constants (and html5-qrcode uses different names)
    const mapFormatsForBarcodeDetector = (fmts: string[]) => {
      // BarcodeDetector expects e.g. "ean_13", "code_128", "qr_code", "upc_a"
      return fmts.map((f) => f.toLowerCase());
    };

    const startWithBarcodeDetector = async () => {
      try {
        const supported = (window as any).BarcodeDetector?.getSupportedFormats
          ? await (window as any).BarcodeDetector.getSupportedFormats()
          : null;

        const desired = mapFormatsForBarcodeDetector(formats);
        // if getSupportedFormats exists, prefer intersection
        const usableFormats =
          Array.isArray(supported) && supported.length
            ? desired.filter((d) => supported.includes(d))
            : desired;

        detector = new (window as any).BarcodeDetector({ formats: usableFormats });

        // ask for camera
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (aborted) return;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setUsing("barcode-detector");

        // loop to detect periodically
        const loop = async () => {
          if (aborted) return;
          try {
            if (!videoRef.current) return;
            // detect using the video element
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes && barcodes.length > 0) {
              // take first result
              const raw = barcodes[0]?.rawValue ?? barcodes[0]?.raw?.value ?? "";
              if (raw) {
                onDetected(raw);
                stopStream();
                return;
              }
            }
          } catch (e) {
            // detection can fail silently on some frames; ignore
            console.warn("BarcodeDetector error", e);
          }
          // schedule next detection
          setTimeout(loop, 1000 / Math.max(1, fps));
        };

        loop();
      } catch (err: any) {
        console.warn("BarcodeDetector start failed, falling back:", err);
        stopStream();
        throw err;
      }
    };

    const startHtml5Qrcode = async () => {
      try {
        const mod = await import("html5-qrcode");
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = mod as any;
        // create element id
        const elementId = "html5-qrcode-root";
        // remove any existing element
        let host = document.getElementById(elementId);
        if (!host) {
          host = document.createElement("div");
          host.id = elementId;
          if (videoRef.current?.parentElement) {
            videoRef.current.parentElement.appendChild(host);
          } else {
            document.body.appendChild(host);
          }
        }
        html5QrRef.current = new Html5Qrcode(elementId);

        // map formats to html5-qrcode constants if possible
        const fmtMap: Record<string, any> = {
          ean_13: Html5QrcodeSupportedFormats.EAN_13,
          code_128: Html5QrcodeSupportedFormats.CODE_128,
          upc_a: Html5QrcodeSupportedFormats.UPC_A,
          qr_code: Html5QrcodeSupportedFormats.QR_CODE,
        };
        const formatsToSupport = formats
          .map((f) => fmtMap[f.toLowerCase() as keyof typeof fmtMap])
          .filter(Boolean);

        setUsing("html5-qrcode");

        await html5QrRef.current.start(
          { facingMode: "environment" },
          {
            fps,
            qrbox,
            formatsToSupport,
          },
          (decodedText: string) => {
            onDetected(decodedText);
            html5QrRef.current?.stop().catch(() => {});
          },
          (errorMessage: any) => {
            // optional: handle scan failure per frame
            // console.warn("html5-qrcode frame failure", errorMessage);
          }
        );
      } catch (e: any) {
        console.error("html5-qrcode failed", e);
        setError("No se pudo iniciar el escáner en este dispositivo.");
      }
    };

    const startScanner = async () => {
      setError(null);
      // prefer BarcodeDetector if available
      if ((window as any).BarcodeDetector) {
        try {
          await startWithBarcodeDetector();
          return;
        } catch (e) {
          // fallback
        }
      }
      // fallback
      await startHtml5Qrcode();
    };

    startScanner();

    return () => {
      aborted = true;
      try {
        if (html5QrRef.current) {
          html5QrRef.current.stop().catch(() => {});
          html5QrRef.current.clear?.();
        }
      } catch {}
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formats, fps, qrbox]);

  return (
    <div className="w-full">
      <div className="relative bg-black rounded-md overflow-hidden">
        {/* video element used by BarcodeDetector path */}
        <video ref={videoRef} className="w-full h-64 object-cover" muted playsInline />
        {/* html5-qrcode will append its UI to DOM when used */}
        {error && <div className="p-2 text-sm text-red-500">{error}</div>}
        <div className="absolute top-2 right-2 text-xs text-white bg-yellow-600/80 px-2 py-1 rounded">
          {using ? (using === "barcode-detector" ? "Detector nativo" : "html5-qrcode") : "Iniciando..."}
        </div>
      </div>
    </div>
  );
}
