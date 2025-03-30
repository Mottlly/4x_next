import React from "react";
import Image from "next/image";

export default function ProjectCard({
  title,
  imageSrc,
  onClick,
  description,
  highlighted,
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl p-4 transition transform hover:scale-[1.03]
        ${
          highlighted
            ? "border-2 border-blue-500 hover:shadow-xl max-w-[340px]"
            : "border border-gray-300 hover:shadow-md max-w-[280px]"
        }
        bg-white dark:bg-gray-800 w-full`}
    >
      <Image
        src={imageSrc}
        alt={title}
        width={400}
        height={240}
        className={`rounded mb-3 w-full ${
          highlighted ? "h-[220px]" : "h-[180px]"
        } object-cover`}
      />
      <h2
        className={`text-center font-semibold ${
          highlighted ? "text-blue-600 text-xl" : "text-lg"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-1">
          {description}
        </p>
      )}
    </div>
  );
}
