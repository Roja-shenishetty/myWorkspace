// src/components/sections/ToolsSection.js
import React from 'react';
import SectionHeading from '../atoms/SectionHeading';
import ToolCard from '../molecules/ToolCard';

const ToolsSection = ({title,data}) => {
  return (
    <section id="toolbelt" className=" px-6 text-center bg-light-bg">
      <div className="max-w-6xl mx-auto">
        <SectionHeading>{title}</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((tool) => (
            <ToolCard
              id={tool.id}
              key={tool.id}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              tags={tool.tags}
              link={tool.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;