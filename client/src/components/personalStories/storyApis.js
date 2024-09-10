// api.js
const apiUrl = process.env.SERVER_APP_URL;
console.log("API URL:", apiUrl);

// Function to fetch stories
export const fetchStories = async () => {
    try {
        const response = await fetch(`${apiUrl}/personalStories/stories`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return { success: true, data: result.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Function to add a story
export const addStory = async (story) => {
    try {
        // const response = await fetch('http://localhost:8080/personalStories/stories', {
        const response = await fetch(`${apiUrl}/personalStories/stories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(story),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
