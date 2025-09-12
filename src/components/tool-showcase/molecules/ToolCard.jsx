// src/components/molecules/ToolCard.js
import React from 'react';
import Tag from '../atoms/Tag';
import { Link } from 'react-router-dom'; // Make sure to import Link


// This component combines atoms to form a more complex element
const ToolCard = ({ id,icon, title, description, tags,link }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col text-left">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
      <p className="text-gray-600 flex-grow mb-4">{description}</p>
      <div className="mb-4">
        {tags?.map((tag) => <Tag key={tag}>{tag}</Tag>)}
      </div>
        {/* This now links to the dynamic route, e.g., "/tools/svg-minify" */}
      <Link to={link} data-id={id} className="font-bold text-secondary hover:underline mt-auto">
        Learn More →
      </Link>
    </div>
  );
};

export default ToolCard;