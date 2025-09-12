import React, { useState } from 'react';

const TreeNode = ({ label, value, onChange }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleKeyChange = (event) => {
    const newKey = event.target.value;
    onChange(newKey, value);
  };

  const handleValueChange = (event) => {
    const newValue = event.target.value;
    onChange(label, newValue);
  };

  if (typeof value === 'object') {
    return (
      <div>
        <span onClick={handleToggle}>{expanded ? '[-]' : '[+]'}</span>
        <input type="text" value={label} onChange={handleKeyChange} />
        <div style={{ marginLeft: '20px' }}>
          {expanded &&
            Object.entries(value).map(([key, val]) => (
              <TreeNode
                key={key}
                label={key}
                value={val}
                onChange={onChange}
              />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div>
       <input type="text" value={value} onChange={handleKeyChange} />
      <input type="text" value={value} onChange={handleValueChange} />
    </div>
  );
};

const jsonData = {
    name: 'John Doe',
    age: 30,
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
    },
  };

const JSONEditor = ({ data = jsonData }) => {
  const [jsonData, setJsonData] = useState(data);

  const handleNodeChange = (key, newValue) => {
    setJsonData((prevData) => ({
      ...prevData,
      [key]: newValue,
    }));
  };

  return (
    <div>
      <TreeNode label="root" value={jsonData} onChange={handleNodeChange} />
    </div>
  );
};

export default JSONEditor;
