import { useState } from "react";
export default function ThemeSelector({setLDTheme}) {
  const [theme, setTheme] = useState(false);

  return (
    <>
      <div
        className="select_theme flex-row background-secondary-1"
        onClick={() => {
            setTheme(prev=>{
                setLDTheme(!prev);
                return !prev
            })
            
        }}
      >
        <span className="icons">🌚🌞</span>
        <div className={`theme_selector icons ${theme ? "right" : "left"}`}>
          
        </div>
      </div>
      <style jsx>
        {`
          .icons {
            font-size: 20px;
          }
          .theme_selector {
            position: absolute;

            width: 25px;
            height: 25px;
            background-color: white;
            border-radius: 50%;
            margin: 3px;

            -moz-user-select: none;
            -khtml-user-select: none;
            -webkit-user-select: none;
            transition: all 0.2s ease-in-out;
          }
          .left {
            right: 0;
          }
          .right {
            right: 26px;
          }
          .select_theme {
            cursor: pointer;
            width: 57px;
            height: 30px;
            margin: 10px;
            position: relative;
            border-radius: 30px;
            display: flex;
            align-items: center;
          }
        `}
      </style>
    </>
  );
}
