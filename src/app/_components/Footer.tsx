import Image from 'next/image';
import Link from 'next/link';
import { RiInstagramFill } from 'react-icons/ri';

export default async function Footer() {
  return (
    <footer>
      <div
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 border-t border-gray-200"
      >
        <div className="text-sm">© {new Date().getFullYear()} innercircle</div>
        <div className="rounded-lg flex items-center px-1">
          <Link
            href="https://instagram.com/innercircle.fam"
            className="p-2 inline-block hover:bg-gray-100 rounded-lg group"
            target="_blank"
          >
            <RiInstagramFill size={22} className="fill-gray-600 group-hover:fill-orange-500" />
          </Link>
          <Link
            href="https://www.xiaohongshu.com/user/profile/5a7a6e4be8ac2b63699feebc"
            className="p-2 inline-block hover:bg-gray-100 rounded-lg group"
            target="_blank"
          >
            <Image
              src="/xiaohongshu.svg"
              width={20}
              height={20}
              className="grayscale group-hover:grayscale-0 opacity-90 group-hover:opacity-100"
              alt="小红书"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
