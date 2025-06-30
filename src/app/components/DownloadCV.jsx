import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const DownloadCV = ({ className, label = "Download CV" }) => {
  const SITE_KEY = "6LdW4EUrAAAAAFa44nZesgzNvKHnC2rXmYdjVriI";

  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [captchaError, setCaptchaError] = useState("");
  const recaptchaRef = useRef(null);

  const cvUrl = "/cv/David_Rene_Metomo_CV.pdf";

  const handleDownloadClick = () => {
    setCaptchaError("");
    setShowCaptcha(true);
  };

  const onCaptchaChange = (token) => {
    if (token) {
      setCaptchaError("");
      setShowCaptcha(false);
      setShowProgress(true);
      setProgress(0);
      triggerDownload();
      startProgress();
    } else {
      setCaptchaError("Vérification échouée, réessayez.");
    }
  };

  const onCaptchaExpired = () => {
    setCaptchaError("Le CAPTCHA a expiré, merci de réessayer.");
  };

  const startProgress = () => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowProgress(false);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const triggerDownload = () => {
    const link = document.createElement("a");
    link.href = cvUrl;
    link.download = "David_Rene_Metomo_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <button onClick={handleDownloadClick} className={className}>
        <span className="block font-extrabold rounded-full px-2 py-1">
          {label}
        </span>
      </button>

      {showCaptcha && (
        <div
          onClick={() => setShowCaptcha(false)} 
          className="fixed top-0 left-0 w-screen h-screen z-50"
          style={{ cursor: "default" }}
        >
          <div
            onClick={(e) => e.stopPropagation()} 
            className="fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-[#121212] px-6 py-4 rounded-xl shadow-xl border border-[#444] max-w-[90vw]"
          >
            <ReCAPTCHA
              sitekey={SITE_KEY}
              onChange={onCaptchaChange}
              onExpired={onCaptchaExpired}
              ref={recaptchaRef}
            />
            {captchaError && (
              <p className="mt-2 text-red-500 text-sm font-semibold">
                {captchaError}
              </p>
            )}
          </div>
        </div>
      )}

      {showProgress && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#222] bg-opacity-90 rounded-lg shadow-lg px-6 py-4 flex flex-col items-center z-50">
          <p className="text-white font-semibold mb-2">
            Téléchargement du CV en cours...
          </p>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="h-4 rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #4f46e5, #a855f7, #ec4899)",
                transition: "width 50ms linear",
              }}
            ></div>
          </div>
        </div>
      )}
    </>
  );
};

export default DownloadCV;
