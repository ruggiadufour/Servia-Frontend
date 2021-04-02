import { Typography } from "@material-ui/core";
import Image from "next/image";
import Link from "next/link";

const cards = [
  {
    title: "Buscá profesionales",
    desc:
      "Encontrá profesionales de diferentes áreas, contactálos y lleva a cabo el servicio que necesitás.",
    src_img: "/svg/search.svg",
  },
  {
    title: "Solicitá al profesional ideal",
    desc:
      "Creá solicitudes de servicios para que un profesional se ofrezca a resolver tu problema.",
    src_img: "/svg/request.svg",
  },
  {
    title: "Contactá a profesionales",
    desc:
      "Hablá directamente al profesional a traves de su número telefónico o hacelo por medio del chat que ofrece Servia.",
    src_img: "/svg/chatting.svg",
  },
  {
    title: "Creá tu perfil",
    desc:
      "Creá tu perfil profesional para que las demás personas puedan ver tus habilidades, trabajos o la información que quieras distinguir.",
    src_img: "/svg/professional-profile.svg",
  },
  {
    title: "Creá publicaciones",
    desc:
      "Creá publicaciones dónde demuestres un tipo de servicio en particular.",
    src_img: "/svg/create-publication.svg",
  },
];

export default function Extra() {
  return (
    <div className="extra  background-2">
      <div className="general-width centering">
        <Typography component="h2" variant="h4" align="left">
          ¿Qué podés hacer en Servia?
        </Typography>
      </div>
      <div className="centering-t general-width flex-row">
        {cards.map((card, i) => (
          <Card key={i} {...card} />
        ))}
      </div>
      <div className="general-width centering">
        <Link href="/preguntas-frecuentes">
          <a className="text-primary-2">¿Qué más puedo hacer?</a>
        </Link>
      </div>
      <style jsx>
        {`
          .extra {
            width: 100%;
            padding: 60px 0;
          }
          a {
            font-size: 20px;
            text-align: center;
            text-decoration: underline;
          }
        `}
      </style>
    </div>
  );
}

function Card({ title, desc, src_img }) {
  return (
    <div className="card background-1">
      <Image
        src={src_img}
        alt="card icon"
        width={300}
        height={300}
        layout="intrinsic"
      />
      <div className="card-content">
        <Typography component="h3" variant="h5" align="left">
          {title}
        </Typography>
        <Typography component="p" align="left" align="justify">
          {desc}
        </Typography>
      </div>
      <style jsx>
        {`
          .card {
            max-width: 300px;
            min-width: 200px;
            min-height: 350px;
            transition: transform .55s;
          }
          .card:hover{
            transform: scale(1.1, 1.1);
            border: solid thin gray;
          }
          .card-content {
            padding: 10px;
          }
        `}
      </style>
    </div>
  );
}
