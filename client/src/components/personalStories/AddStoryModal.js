import React, { useRef, useState } from 'react';
import { IoClose } from "react-icons/io5";
import './PersonalStories.css';
import { addStory } from './storyApis';

// Initial validation state
let initialValidation = {
    validName: true,
    validLocation: true,
    validDescription: true
}

const AddStoryModal = ({ setIsModalOpen, onRequestClose, setStories }) => {
    const form = useRef();
    const [fieldsValidation, setFieldsValidation] = useState(initialValidation);

    // Clears all fields in the form
    const onClickClear = () => {
        if (form.current) {
            form.current.reset();
        }
    };

    // Resets the field validations
    const resetValidation = () => {
        setTimeout(() => {
            setFieldsValidation(initialValidation);
            return;
        }, 1000);
    }

    // Add story
    const onClickAddStory = async (e) => {
        e.preventDefault();
        resetValidation();
        const { name, location, description } = e.target.elements;

        // Validate name
        if (name.value.trim() === "" || name.value.length < 3) {
            setFieldsValidation(prev => ({ ...prev, validName: false }));
            navigator.vibrate([200, 100, 200]);
            return;
        }

        // Validate location
        if (location.value.trim() === "" || location.value.length < 4) {
            setFieldsValidation(prev => ({ ...prev, validName: true, validLocation: false }));
            navigator.vibrate([200, 100, 200]);
            return;
        }

        // Validate description
        if (description.value.trim() === "") {
            setFieldsValidation(prev => ({ ...prev, validName: true, validLocation: true, validDescription: false }));
            navigator.vibrate([200, 100, 200]);
            return;
        }

        // Prepare data for storage
        const storyData = {
            name: name.value.trim(),
            location: location.value.trim(),
            description: description.value.trim()
        };

        const result = await addStory(storyData);
        console.log('result: ', result);
        if (result.success) {
            name.value = "";
            location.value = "";
            description.value = "";
            setStories((prevStories) => [...prevStories, result.data.story]);
            onRequestClose();
        } else {
            console.error('Error adding story:', result.error);
        }
    };

    // Close modal
    const onClickClose = () => {
        setIsModalOpen(false);
    }

    const { validName, validLocation, validDescription } = fieldsValidation;

    return (
        <div onRequestClose={onRequestClose} className="story-modal">
            <div className="story-modal-header">
                <h2>Add Your Story</h2>
                <button onClick={onClickClose}><IoClose /></button>
            </div>
            <form className='story-modal-form-con' ref={form} onSubmit={onClickAddStory}>
                <div className="story-modal-above-container">
                    <input
                        className={`user-details ${!validName ? 'field-validation' : ''}`}
                        type="text"
                        name="name"
                        placeholder={`${validName ? 'Name' : 'Please enter your name!'}`}
                        maxLength={40}
                        autoComplete='off'
                    />
                    <input
                        className={`user-details ${!validLocation ? 'field-validation' : ''}`}
                        type="text"
                        name="location"
                        placeholder={`${validLocation ? 'Location: State, Country.' : 'Don’t forget your location!'}`}
                        maxLength={40}
                        autoComplete='off'
                    />
                </div>
                <textarea
                    className={`user-text ${!validDescription ? 'text-area-validation' : ''}`}
                    rows="8"
                    cols="50"
                    name="description"
                    placeholder={`${validDescription ? 'Share your amazing story...' : 'We’d love to hear your story!'}`}
                    maxLength={4000}
                    autoComplete='off'
                />
                <div className="modal-buttons">
                    <button type="button" className='add-story-modal-btn clear-btn' onClick={onClickClear}>Clear</button>
                    <button type="submit" className='add-story-modal-btn add-btn'>Add</button>
                </div>
            </form>
        </div>
    );
};

export default AddStoryModal;
