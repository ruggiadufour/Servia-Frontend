import { useEffect, useState } from "react";
import Image from "next/image";

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      console.log("we are being triggered :D");
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("transitionend", handler);
  }, []);

  const onClick = (evt) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };
  if (!supportsPWA) {
    return null;
  }
  return (
    <>
      <div onClick={onClick} className="install-button background-1 text-dark-1">
        <Image src="/playapp.png" width={100} height={50} layout="intrinsic" />
        <span className="install-text">Instalar aplicación</span>
      </div>
      <style jsx>
        {`
          .install-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: max-content;
            border-radius: 5px;
            padding: 5px;
            margin: auto;
          }
          .install-button:hover{
            opacity: .7;
            cursor: pointer;
          }
          .install-text{
            font-size: 25px;
            margin: 5px;
          }
        `}
      </style>
    </>
  );
};

export default InstallPWA;
