import Image from 'next/image';
import Link from 'next/link';

export default async function Footer() {
  return (
    <footer className="max-w-6xl w-full mx-auto">
      <div
        className="flex items-center justify-between px-6 py-3 border-t border-gray-200"
      >
        <div className="text-sm">© {new Date().getFullYear()} innercircle</div>
        <div className="rounded-lg flex items-center px-1">
          <Link
            href="https://instagram.com/innercircle.fam"
            className="p-2 inline-block hover:bg-gray-100 rounded-lg group"
            target="_blank"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 56 56" className="fill-gray-600 group-hover:fill-orange-500"><path fill="currentColor" fillRule="evenodd" d="M39.006 3C46.735 3 53 9.27 53 16.994v22.012C53 46.735 46.73 53 39.006 53H16.994C9.265 53 3 46.73 3 39.006V16.994C3 9.265 9.27 3 16.994 3zM28 15c-7.18 0-13 5.82-13 13s5.82 13 13 13s13-5.82 13-13s-5.82-13-13-13m0 4a9 9 0 1 1 0 18a9 9 0 0 1 0-18m14.5-9a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7"/></svg>
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
