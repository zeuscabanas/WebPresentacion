import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectDetail from './ProjectDetail';

const Project = ({ name, level, description, image }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleOpenDetail = () => {
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  return (
    <motion.div
      className="project p-4 flex flex-col items-start"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minWidth: '300px' , width: '100%'}}
    >
      <div className="flex items-center w-full cursor-pointer" onClick={handleOpenDetail}>
        <div className="project-icon bg-green-500 p-2 rounded-full mr-4 border-green-500"></div>
        <div className="project-details flex-1">
          <h3 className="text-lg font-bold">{name}</h3>
          <div className="project-bar bg-gray-300 h-4 rounded-full overflow-hidden">
            <div
              className="project-level bg-blue-500 h-full"
              style={{ width: `${level}%` }}
            ></div>
          </div>
        </div>
      </div>
      {isDetailOpen && (
        <ProjectDetail
          name={name}
          description={description}
          image={image}
          onClose={handleCloseDetail}
        />
      )}
    </motion.div>
  );
};

export default Project;
