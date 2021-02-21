import { Typography } from "@material-ui/core";
import Image from "next/image";

const cards = [
  {
    title: "Crear tu perfil",
    desc:
      "Creá tu perfil profesional para que las demás personas puedan ver tus habilidades, trabajos o la información que quieras distinguir.",
    src_img: "/tester.jpg",
  },
  {
    title: "Crear publicaciones",
    desc:
      "Creá publicaciones dónde demuestres un tipo de servicio en particular.",
    src_img: "/tester.jpg",
  },
];

export default function Extra() {
  return (
    <div className="extra ">
      <div className="general-width centering">
        <Typography component="h2" variant="h4" align="left">
          ¿Qué podés hacer en Servia?
        </Typography>
      </div>
      <div className="centering general-width flex-row">
        {cards.map((card, i) => (
          <Card key={i} {...card} />
        ))}
      </div>
      <style jsx>
        {`
          .extra {
            background-color: gray;
            width: 100%;
            padding: 60px 0;
          }
        `}
      </style>
    </div>
  );
}

function Card({ title, desc, src_img }) {
  return (
    <div className="card">
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
            background-color: white;
          }
          .card-content {
            padding: 10px;
          }
        `}
      </style>
    </div>
  );
}
