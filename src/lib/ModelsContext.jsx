import { createContext, useContext, useState } from 'react';

const ModelsContext = createContext();

export const useModels = () => useContext(ModelsContext);

export const ModelsProvider = ({ children }) => {
  const [models, setModels] = useState([]);

  const updateModels = (newModels) => {
    setModels(newModels);
  };

  return (
    <ModelsContext.Provider value={{ models, updateModels }}>
      {children}
    </ModelsContext.Provider>
  );
};
