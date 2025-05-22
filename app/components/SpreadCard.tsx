import Image from 'next/image';
import Link from 'next/link';

interface SpreadCardProps {
  title: string;
  description: string;
  buttonText: string;
  linkHref: string;
  imageSrc: string;
  imageAlt: string;
}

const SpreadCard: React.FC<SpreadCardProps> = ({
  title,
  description,
  buttonText,
  linkHref,
  imageSrc,
  imageAlt,
}) => {
  return (
    <div className="flex flex-col items-center p-6 bg-agatha-deeper border border-gold-400 rounded-lg shadow-xl hover:shadow-gold-400/30 transition-all duration-300 transform hover:-translate-y-1">
      <h3 className="text-2xl font-witchcraft text-gold-400 mb-3 text-center">{title}</h3>
      <div className="relative w-32 h-48 md:w-40 md:h-64 mb-4 rounded-md overflow-hidden shadow-lg border border-gold-500">
        <Image
          src={imageSrc}
          alt={imageAlt}
          layout="fill"
          objectFit="cover"
          className="transform transition-transform duration-500 hover:scale-105"
        />
      </div>
      <p className="text-agatha-light text-sm text-center mb-5 h-20 overflow-y-auto custom-scrollbar">
        {description}
      </p>
      <Link href={linkHref} passHref>
        <button className="mt-auto bg-gold-400 text-[#1E1E3F] hover:bg-gold-500 px-6 py-3 rounded-xl font-semibold transition-colors duration-300 w-full md:w-auto">
          {buttonText}
        </button>
      </Link>
    </div>
  );
};

export default SpreadCard;

// Basic custom scrollbar styling (can be moved to global.css if preferred)
// Ensure your global CSS or a style tag handles this if not using Tailwind's plugin for scrollbars.
// For simplicity, adding it here, but ideally, it would be in a global stylesheet.
// If you have a global CSS file, add:
/*
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #2E2E5F; // agatha-mid
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #C8AD7F; // gold-400
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #B8986A; // gold-500
}
*/ 