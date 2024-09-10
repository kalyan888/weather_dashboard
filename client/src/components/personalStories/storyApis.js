// api.js
const apiUrl = process.env.REACT_APP_API_URL;
console.log("API URL:", apiUrl);
// const storiesUrl = `${apiUrl}/personalStories/stories`;

// Function to fetch stories
export const fetchStories = async () => {
    try {

        const response = await fetch('http://localhost:8080/personalStories/stories');
        // const response = await fetch(`${apiUrl}/personalStories/stories`);
        console.log('Fetch response: ', response);

        if (!response.ok) {
            console.log("Error fetching stories:", response.statusText);
            return { success: false, error: response.statusText };
        }

        const result = await response.json();
        console.log("Fetched stories:", result.data);
        return { success: true, data: result.data };
    } catch (error) {
        console.error('Error fetching stories:', error);
        return { success: false, error: error.message };
    }
};

// Function to add a story
export const addStory = async (story) => {
    try {
        const response = await fetch('http://localhost:8080/personalStories/stories', {
            // const response = await fetch(`${process.env.REACT_APP_API_URL}/personalStories/stories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(story),
        });

        if (!response.ok) {
            console.log("Error adding story:", response.statusText);
            return { success: false, error: response.statusText };
        }

        const result = await response.json();
        console.log('Story added:', result);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error adding story:', error);
        return { success: false, error: error.message };
    }
};
