import React from "react";

const NorthTopIcon = ({ color = "black", size = 200, title = "" }) => {
  const width = size;
  const height = size;

  return (
    <div title={title}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="100"
        cy="100"
        r="50"
        stroke={color}
        strokeWidth="4"
        fill="none"
      />
      <text x="100" y="115" fontSize="40" textAnchor="middle" fill={color}>
        N
      </text>
      {/* left */}
      <line x1="35" y1="100" x2="65" y2="100" stroke={color} strokeWidth="4" />
      {/* bottom */}
      <line
        x1="100"
        y1="135"
        x2="100"
        y2="165"
        stroke={color}
        strokeWidth="4"
      />
      {/* right */}
      <line
        x1="165"
        y1="100"
        x2="135"
        y2="100"
        stroke={color}
        strokeWidth="4"
      />
      {/* Top */}
      <polygon
        points="85,65 100,25 115,65"
        fill={"blue"}
        stroke={color}
        strokeWidth="2"
      />
      </svg>
    </div>
  );
};

const NorthRightIcon = ({ color = "black", size = 200, title = "" }) => {
  const width = size;
  const height = size;

  return (
    <div title={title}>
      <svg
        width={width}
      height={height}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="100"
        cy="100"
        r="50"
        stroke={color}
        strokeWidth="4"
        fill="none"
      />
      <text x="100" y="115" fontSize="40" textAnchor="middle" fill={color}>
        N
      </text>
      {/* top */}
      <line x1="100" y1="35" x2="100" y2="65" stroke={color} strokeWidth="4" />
      {/* bottom */}
      <line
        x1="100"
        y1="135"
        x2="100"
        y2="165"
        stroke={color}
        strokeWidth="4"
      />
      {/* left */}
      <line x1="35" y1="100" x2="65" y2="100" stroke={color} strokeWidth="4" />
      {/* right */}
      <polygon
        points="135,85 175,100 135,115"
        fill={"blue"}
        stroke={color}
        strokeWidth="2"
      />
      </svg>
    </div>
  );
};

const NorthLeftIcon = ({ color = "black", size = 200, title = "" }) => {
  const width = size;
  const height = size;

  return (
    <div title={title}>
      <svg
        width={width}
      height={height}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="100"
        cy="100"
        r="50"
        stroke={color}
        strokeWidth="4"
        fill="none"
      />
      <text x="100" y="115" fontSize="40" textAnchor="middle" fill={color}>
        N
      </text>
      {/* Top */}
      <line x1="100" y1="35" x2="100" y2="65" stroke={color} strokeWidth="4" />
      {/* bottom */}
      <line
        x1="100"
        y1="135"
        x2="100"
        y2="165"
        stroke={color}
        strokeWidth="4"
      />
      {/* Right */}
      <line
        x1="165"
        y1="100"
        x2="135"
        y2="100"
        stroke={color}
        strokeWidth="4"
      />
      {/* Left */}
      <polygon
        points="65,85 25,100 65,115"
        fill={"blue"}
        stroke={color}
        strokeWidth="2"
      />
      </svg>
    </div>
  );
};

export { NorthTopIcon, NorthRightIcon, NorthLeftIcon };
