"use client";
import React from "react";
import Link from "next/link";

const NavLink = ({ href, title }) => {
  return (
    <Link href={href} scroll={false} className="relative group text-white font-medium text-md ">
      {title}
      <span className="absolute bottom-[-6px] left-0 h-[3px] w-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 transition-all duration-500 group-hover:w-full"></span>
    </Link>
  );
};

export default NavLink;
