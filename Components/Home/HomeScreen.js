import { Typography } from "@material-ui/core";
export default function HomeScreen() {
  return (
    <>
      <div className="screen-container">
        <div className="screen-text">
          <h1>
            <strong className="text-secondary-1">Servia - ¡Encuentra tu servicio ideal!</strong>
          </h1>
          <h2 className="text-secondary-2">¿Necesitas a un profesional ya?</h2>
          <p className="text-secondary-2">
            Encontralo en Servia, podés ver los perfiles de profesionales de
            distintas áreas, los trabajos que han realizado y si encontrás al
            indicado, podés hablarle directamente.
          </p>
        </div>
      </div>
      <style jsx>{`
        h1 {
          font-size: 45px;
          text-align: center;
        }
        h2 {
          font-size: 40px;
          text-align: center;
        }
        p {
          display: block;
          font-size: 31px;
          text-align: justify;
        }
        .screen-container {
          background-color: lightgreen;
          background-image: url("/tester.jpg");
          background-position: center;
          background-size: cover;
          background-blend-mode: soft-light;
          background-color: #2c2833;
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
        }
        .screen-text {
          padding: 5%;
        }
      `}</style>
    </>
  );
}
