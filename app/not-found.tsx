import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-[#08090a] p-6"><div className="text-center"><BrandMark /><p className="mt-8 text-sm text-[#89969c]">This signal does not exist.</p><Link href="/" className="mt-5 inline-block text-xs text-[var(--cyan)]">Return to command center</Link></div></main>;
}
