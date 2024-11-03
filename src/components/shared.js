import React, { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { GoMoon } from "react-icons/go";
import { MdOutlineWbSunny } from "react-icons/md";
import squareOne from "../assets/images/squares/one.png";
import squareTwo from "../assets/images/squares/two.png";
import squareThree from "../assets/images/squares/three.png";
import squareFour from "../assets/images/squares/four.png";
import squareFive from "../assets/images/squares/five.png";
import pinOne from "../assets/images/pins/one.png";
import pinTwo from "../assets/images/pins/two.png";
import pinThree from "../assets/images/pins/three.png";

export const pinIcon = (number) => {
  switch (number) {
    case 1:
      return pinOne;
    case 2:
      return pinTwo;
    case 3:
      return pinThree;
    default:
      return pinOne;
  }
};

export const squareIcon = (number) => {
  switch (number) {
    case 1:
      return squareOne;
    case 2:
      return squareTwo;
    case 3:
      return squareThree;
    case 4:
      return squareFour;
    case 5:
      return squareFive;
    default:
      return squareOne;
  }
};

const TimestampToDate = ({ time, style = "" }) => {
  const [day, setDay] = useState("");
  const [mounth, setMounth] = useState("");
  const [year, setYear] = useState("");

  const mounth_pt = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const mounth_en = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const firebaseTime = new Date(
    time?.seconds * 1000 + time?.nanoseconds / 1000000
  );
  const date = firebaseTime.toDateString();

  const sliceDate = (dat) => {
    // convert dat to string
    dat = dat.toString();

    mounth_en.map((m_en, idx) => {
      if (m_en === dat.slice(4, 7)) {
        setMounth(mounth_pt[idx]);
      }
    });

    setDay(dat.slice(8, 10));
    setYear(dat.slice(11, 15));
  };

  useEffect(() => {
    sliceDate(date);
  }, []);

  return <span className={style}>{day + " de " + mounth + " de " + year}</span>;
};

const ButtonWithSpinner = ({
  variant,
  onClick = undefined,
  type = "button",
  animation = "border",
  size = undefined,
  value = false,
}) => {
  return (
    <Button variant={variant} onClick={onClick} type={type}>
      <Spinner
        className="mr-2"
        as="span"
        animation={animation}
        size={size ? size : "sm"}
        role="status"
        aria-hidden="true"
      />
      {value || "Carregar..."}
    </Button>
  );
};

export const toCaptalizer = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const ThemeModeSwitch = ({ theme, changeMode, setChangeMode, toggleTheme }) => {
  return (
    <button
      className={`flex space-x-3 items-center ${
        theme === "light"
          ? "bg-blue-900/75 hover:bg-blue-900 text-light"
          : "bg-blue-300/75 hover:bg-blue-400 text-warning"
      } p-1 rounded`}
      onClick={() => toggleTheme()}
    >
      {theme === "light" && <GoMoon size={22} />}
      {theme === "dark" && <MdOutlineWbSunny size={22} />}
    </button>
  );
};

export { TimestampToDate, ButtonWithSpinner, ThemeModeSwitch };
