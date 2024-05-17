import { motion } from 'framer-motion';

const Skill = ({ name, level, duration, role }) => {

  return (
    <motion.div
      className="skill p-4 flex flex-col items-start"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ maxWidth: '300px', width: '100%' }} // Ajuste del tamaño mínimo
    >
      <div className="flex items-center w-full">
        <div className="skill-icon bg-green-500 p-2 rounded-full mr-4"></div>
        <div className="skill-details flex-1">
          <h3 className="text-lg font-bold">{name}</h3>
          <div className="skill-bar bg-gray-300 h-4 rounded-full overflow-hidden">
            <div
              className="skill-level bg-blue-500 h-full"
              style={{ width: `${level}%` }}
            ></div>
          </div>
        </div>
      </div>
      
    </motion.div>
  );
};

export default Skill;