"use client";
// Import required dependencies
import React, { useState } from 'react';

const CampaignForm: React.FC = () => {
  // State to handle form inputs
  const [formData, setFormData] = useState({
    campaignName: '',
    description: '',
    image: null as File | null,
    budget: '',
    startDate: '',
    endDate: '',
    adType: '',
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add form submission logic here (e.g., API call)
    console.log('Form Data:', formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create a Campaign</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campaign Name */}
        <div>
          <label htmlFor="campaignName" className="block font-medium">Campaign Name</label>
          <input
            type="text"
            id="campaignName"
            name="campaignName"
            value={formData.campaignName}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block font-medium">Upload Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1"
          />
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block font-medium">Budget ($)</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block font-medium">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block font-medium">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Ad Type */}
        <div>
          <label htmlFor="adType" className="block font-medium">Ad Type</label>
          <select
            id="adType"
            name="adType"
            value={formData.adType}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Ad Type</option>
            <option value="banner">Banner</option>
            <option value="video">Video</option>
            <option value="carousel">Carousel</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600"
        >
          Create Campaign
        </button>
      </form>
    </div>
  );
};

export default CampaignForm;
