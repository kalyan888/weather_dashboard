const Story = require("../models/Story");

const storiesGetController = async (req, res) => {
    try {
        const stories = await Story.find(); // This retrieves all documents from the collection

        // Return data in the response
        return res.status(200).json({ success: true, data: stories });

    } catch (err) {
        return res.status(404).json({
            success: false,
            message: 'Failed to retrieve stories, Please check the URL',
            error: err.message
        });
    }
}


const storiesPostController = async (req, res) => {
    try {
        const { name, location, description } = req.body;

        // Validation
        if (!name || !location || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please enter all fields'
            });
        }

        // Create a new story
        const newStory = await Story.create({
            name,
            location,
            description
        });

        // Respond with the newly created story
        res.status(201).send({
            success: true,
            message: 'Story created successfully',
            story: newStory
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};




module.exports = { storiesGetController, storiesPostController }