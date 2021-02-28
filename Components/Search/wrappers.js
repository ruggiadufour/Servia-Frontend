export function Wrapper1({ children }) {
  return (
    <>
      <div className="general-width w-100 row-container flex-row background-2">
        {children}
      </div>
      <style jsx>
        {`
          .row-container {
            margin: 15px auto;
          }
        `}
      </style>
    </>
  );
}

export function Wrapper2({ children }) {
  return (
    <>
      <div className="row background-1">
        {children}
      </div>
      <style jsx>
        {`
          .row {
            
            background-color: lightgray;
            padding: 10px;
            border-radius: 5px;
            max-width: 500px;
          }
        `}
      </style>
    </>
  );
}
