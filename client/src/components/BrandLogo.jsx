import React from "react";

export default function BrandLogo({ light = false }) {
  return (
    <div className={`ias-brand ${light ? "ias-brand-light" : ""}`}>
      <svg
        className="ias-brand-mark"
        viewBox="0 0 64 64"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="iasGold"
            x1="8"
            y1="54"
            x2="54"
            y2="8"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#c99634" />
            <stop offset=".52" stopColor="#f0c76d" />
            <stop offset="1" stopColor="#b77d1f" />
          </linearGradient>

          <linearGradient
            id="iasTeal"
            x1="10"
            y1="10"
            x2="54"
            y2="54"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1cb6a5" />
            <stop offset="1" stopColor="#0b6f75" />
          </linearGradient>
        </defs>

        <path
          d="M12 49V18.5c0-2.2 1.8-4 4-4h4v34.5h-8Z"
          fill={light ? "#ffffff" : "#0c2637"}
        />

        <path
          d="M25 49V26.5l8.7 13.2L42 25v24h-7V38.6l-7.6 11.1L20 39v10h5Z"
          fill={light ? "#e8f5f5" : "url(#iasTeal)"}
        />

        <path
          d="M9 48.5 29 31.8l7 4.7L52 15"
          fill="none"
          stroke="url(#iasGold)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="m45.2 15.8 9.2-4-1 9.9"
          fill="none"
          stroke="url(#iasGold)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle
          cx="29"
          cy="31.8"
          r="2.6"
          fill="#e9bd5e"
        />
      </svg>

      <div className="ias-brand-text">
        <strong>INTIME</strong>
        <span>Advisory Services</span>
        <small>COMPLIANCE · CLARITY · GROWTH</small>
      </div>
    </div>
  );
}