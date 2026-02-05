import React, { useState } from 'react';
import { addResource } from '../services/api';


interface Props {
  onSuccess: () => void;
}

const AddResource: React.FC<Props> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    resource_type: 'Video',
    difficulty_level: 1,
    description: '',
    url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addResource(formData);
      alert("✅ Resource added successfully!");
      setFormData({ title: '', resource_type: 'Video', difficulty_level: 1, description: '', url: '' });
      onSuccess(); // Refreshes the list on the main page
    } catch (err) {
      alert("❌ Error adding resource");
    }
  };

  return (
    <div className="add-resource-container">
      <h2>Add New Resource</h2>
      <form className="add-resource-form" onSubmit={handleSubmit}>
        <input 
          className="form-input"
          placeholder="Resource Title"
          value={formData.title}
          onChange={e => setFormData({...formData, title: e.target.value})}
          required 
        />

        <div className="form-group-row">
          <select 
            className="form-input"
            value={formData.resource_type}
            onChange={e => setFormData({...formData, resource_type: e.target.value})}
          >
            <option value="Video">Video</option>
            <option value="Article">Article</option>
            <option value="Document">Document</option>
          </select>

          <input 
            className="form-input"
            type="number" 
            min="1" max="4"
            value={formData.difficulty_level}
            onChange={e => setFormData({...formData, difficulty_level: parseInt(e.target.value)})}
            required 
          />
        </div>

        <textarea 
          className="form-input"
          placeholder="Description"
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          required 
        />

        <input 
          className="form-input"
          type="url" 
          placeholder="URL (https://...)"
          value={formData.url}
          onChange={e => setFormData({...formData, url: e.target.value})}
          required 
        />

        <button type="submit" className="submit-btn">Add to NextSwim</button>
      </form>
    </div>
  );
};

export default AddResource;