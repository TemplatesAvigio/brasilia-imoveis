import Image from "next/image";
import logoImg from "@/assets/logo.png";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src={logoImg}
        alt="Brasília Imóveis & Seguros"
        width={200}
        height={60}
        className="h-12 w-auto"
        priority
      />
    </Link>
  );
}
