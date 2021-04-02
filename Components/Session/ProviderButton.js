import Image from "next/image";
import { useRouter } from "next/router";
export default function ProviderButton({ provider }) {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API;
  return (
    <>
      <div
        onClick={() => {
          router.push(`${API}/connect/${provider}`);
        }}
        className={`flex-row button ${provider}`}
      >
        <Image
          src={`/${provider}.png`}
          alt={`${provider} button logo`}
          width={25}
          height={25}
          layout="intrinsic"
          quality={75}
        />

        <span>{`Iniciar con ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}</span>
      </div>
      <style jsx>
        {`
          .facebook {
            border: solid thin #444;
            background: white;
            background-color: #3b5998;
          }
          .facebook span {
            color: white;
          }

          .google {
            color: black;
            border: solid thin #444;
            background-color: white;
          }
          .google span {
            color: black;
          }

          span {
            align-self: center;
          }

          .button {
            padding: 5px;
            border-radius: 3px;
            font-weight: 500;
            gap: 5px;
            transition: transform 0.15s;
          }

          .button:hover {
            cursor: pointer;
            transform: scale(1.05);
            opacity: 0.85;
          }
        `}
      </style>
    </>
  );
}
