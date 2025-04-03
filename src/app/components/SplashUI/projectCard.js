import React from "react";
import Image from "next/image";
import { projectCardStyles } from "../../../library/styles/splash/components/projectCardStyles";

export default function ProjectCard({
  title,
  imageSrc,
  onClick,
  description,
  highlighted,
}) {
  return (
    <div onClick={onClick} className={projectCardStyles.container(highlighted)}>
      <Image
        src={imageSrc}
        alt={title}
        width={400}
        height={240}
        className={projectCardStyles.image(highlighted)}
      />
      <h2 className={projectCardStyles.title(highlighted)}>{title}</h2>
      {description && (
        <p className={projectCardStyles.description}>{description}</p>
      )}
    </div>
  );
}
