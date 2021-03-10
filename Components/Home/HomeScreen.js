import InstallPWA from './InstallPWA'
export default function HomeScreen() {
  return (
    <>
      <div className="screen-container home-background">
        <div className="screen-text">
          <h1>
            <strong className="text-dark-1 servia-font">
              ¡Encontrá tu servicio ideal en Servia!
            </strong>
          </h1>
          <InstallPWA/>
          <h2 className="text-dark-2 servia-font">
            ¿Necesitas a un profesional ya?
          </h2>
          <p className="text-dark-2 servia-font">
            Encontralo en Servia, podés ver los perfiles de profesionales, los
            trabajos que han realizado y si encontrás al indicado, podés
            hablarle directamente.
          </p>
        </div>
      </div>
      {/* background-blend-mode: darken;  */}
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
          background-position: center;
          background-size: cover;

          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
        }
        .screen-text {
          padding: 5%;
        }
        .servia-title {
          font-size: 2.5rem;
        }
      `}</style>
    </>
  );
}
