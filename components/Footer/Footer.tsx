import Link from "next/link";

export const Footer = () => {
  return (
    <footer className={"flex justify-center p-4 border-t-2 w-full"}>
      <Link href={"https://github.com/tbguest"}>@tbguest</Link>
    </footer>
  );
};
