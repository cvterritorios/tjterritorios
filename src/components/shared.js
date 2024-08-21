import React, { useEffect, useState } from "react";

const TimestampToDate = ({ time, style="" }) => {
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

  return (
    <span className={style}>
      {day + " de " + mounth + " de " + year}
    </span>
  );
};

export { TimestampToDate };
