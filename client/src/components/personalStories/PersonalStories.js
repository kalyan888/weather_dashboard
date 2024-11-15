import React, { useEffect, useState } from 'react';
import { FcSearch } from 'react-icons/fc';
import { useSelector } from 'react-redux';
import AddStoryModal from './AddStoryModal';
import './PersonalStories.css';
import { fetchStories } from './storyApis';

const PersonalStory = () => {
  // State to track which story card is expanded
  const { appliedTheme } = useSelector((state) => state.themesSlice);
  const [expandedStoryIndex, setExpandedStoryIndex] = useState(null);
  const [stories, setStories] = useState([]);
  const [searchStory, setSearchStory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);


  const loadStories = async () => {
    try {
      const result = await fetchStories(); // Fetches all stories

      if (!result.success) {
        throw new Error('Response was not ok');
      }

      if (result.success) {
        setStories(result.data);
      } else {
        console.error('Error loading stories:', result.error);
      }
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  };


  useEffect(() => {
    loadStories();
  }, []);

  const filteredStories = stories.filter((story) =>
    story.name.toLowerCase().includes(searchStory.toLowerCase()) ||
    story.location.toLowerCase().includes(searchStory.toLowerCase())
  );

  // Toggle the expanded state for a story card
  const toggleExpand = (index) => {
    setExpandedStoryIndex(expandedStoryIndex === index ? null : index);
  };

  // AddStory functions

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const onClickAddStory = () => {
    openModal();
  }

  const convertNewlinesToBr = (text) => {
    return text.split('\n').map((str, index) => (
      <React.Fragment key={index}>
        {str}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <>
      {isModalOpen && <AddStoryModal
        setIsModalOpen={setIsModalOpen}
        onRequestClose={closeModal}
        setStories={setStories}
      />}
      <div className={`weather-stories-container ${appliedTheme}`}>
        {/* Story Above Container */}
        <div className="story-above-container">
          <h1>Share Your Weather Story</h1>
          <span>Every weather experience is unique. Whether it's a sunny day that lifted your spirits or a storm that brought unexpected challenges, we want to hear about it. Share your story with us—your name, location, and how the weather impacted your day. Let's build a community where we connect through our weather tales.</span>
        </div>

        {/* Story Below Container */}
        <div className="story-below-container">
          {/* Top Container */}
          <div className="top-container">
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="search-field"
                placeholder="Search by Name/Location"
                onChange={(e) => setSearchStory(e.target.value)}
              />
              <FcSearch className="search-icon" />
            </div>
            <button className="add-story-button" onClick={onClickAddStory}>Add Story</button>
          </div>

          {/* Bottom Container */}
          <div className="bottom-container">
            <div className="story-cards-container">
              {filteredStories.length === 0 ? (
                <div className="loading-container">
                  <p>Loading stories...</p>
                </div>
              ) : (
                filteredStories.map((story, index) => (
                  <div className={`story-card ${expandedStoryIndex === index ? 'expanded' : ''}`} key={index}>
                    <div className="story-card-header" onClick={() => toggleExpand(index)}>
                      <h1>{story.name}</h1>
                      <p>{story.location}</p>
                      <button className="expand-button">
                        {expandedStoryIndex === index ? 'Collapse' : 'View Story'}
                      </button>
                    </div>
                    <p className={`story-description ${expandedStoryIndex === index ? 'full' : 'truncated'}`}>
                      {convertNewlinesToBr(story.description)}
                    </p>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div></>
  );
};

export default PersonalStory;