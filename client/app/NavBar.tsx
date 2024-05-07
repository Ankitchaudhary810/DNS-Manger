"use client";
import Link from "next/link";
import React from "react";
import { FaServer } from "react-icons/fa6";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const links = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "About", href: "/about" },
  ];

  const currentPath = usePathname();

  return (
    <nav className="flex justify-between items-center border-b border-zinc-700 mb-6 px-5 h-14">
      <Link href="/">
        <FaServer size={30} color="#7D96F0" />
      </Link>
      <ul className="flex space-x-6 ">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              className={`${
                link.href === currentPath ? " outline outline-1" : "text-black"
              } transition-colors px-2 py-1 rounded`}
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
