const Tag = require("../models/tags");
const Question = require("../models/questions");
const Answer = require("../models/answers");

const addTag = async (tname) => {
    let tag = await Tag.findOne({ name: tname });
    if (!tag) {
        let newTag = new Tag({ name: tname });
        newTag = await newTag.save();
        return newTag._id;
    }
    return tag._id;
};

const getQuestionsByOrder = async (order) => {
    // complete the function
    let questions;
    
    switch (order) {
        case 'newest':
            // Fetch questions sorted by the date they were posted, most recent first
            questions = await Question.find().populate('tags').populate('answers');
            questions = questions.sort((a, b) => b.ask_date_time - a.ask_date_time);
            break;
        
        case 'active':
            // sort question by most recently answered
            // questions = await Question.find().sort({ 'answers.0.ask_date_time': -1 }).populate('tags').populate('answers'); // Adjust based on your schema
            questions = await Question.find().populate('tags').populate('answers')
            questions = questions.sort((a, b) => b.ask_date_time - a.ask_date_time);
            questions = questions.sort((a, b) => {
                // find most recent answer for each question and compare them to sort
                // if no answer is found, should come after questions with answers
                // if latest answer is same, sort by question date
                const aAnswers = a.answers;
                const bAnswers = b.answers;
                const aMostRecentAnswer = aAnswers.map(a => a.ans_date_time).sort((a, b) => b - a)[0];
                const bMostRecentAnswer = bAnswers.map(a => a.ans_date_time).sort((a, b) => b - a)[0];
                if (!aMostRecentAnswer && !bMostRecentAnswer) {
                    return b.ask_date_time - a.ask_date_time;
                } else if (aMostRecentAnswer && !bMostRecentAnswer) {
                    return -1;
                } else if (!aMostRecentAnswer && bMostRecentAnswer) {
                    return 1;
                }
                if (aMostRecentAnswer === bMostRecentAnswer) {
                    // log date to debug
                    // return question most recent asked
                    return b.ask_date_time - a.ask_date_time;
                }
                return bMostRecentAnswer - aMostRecentAnswer;
            }
            );
            break;
        
        case 'unanswered':
            // Fetch questions that have no answers associated with them
            questions = await Question.find().populate('tags');
            questions = questions.sort((a, b) => b.ask_date_time - a.ask_date_time);
            questions = questions.filter(question => question.answers.length === 0);
            break;
        
        default:
            // Handle default case or throw an error
            throw new Error('Invalid order type');
    }
    
    return questions;
}

const filterQuestionsBySearch = (qlist, search) => {
    search = search.toLowerCase();
    if (search === '') {
        // Return all questions if the search string is empty
        return qlist;
    }

    const keywords = search.split(' ')
    .filter(word => !word.startsWith('[') && !word.endsWith(']'))
    .map(word => word.toLowerCase());

    const tags = search.match(/\[([^\]]+)\]/g)
        ?.map(tag => tag.replace(/\[|\]/g, '').toLowerCase()) || [];

    // if (search.includes('[') && search.includes(']')) {
    //     // Extract tag names from the search string
    //     const tags = search.match(/\[([^\]]+)\]/g).map(tag => tag.replace(/\[|\]/g, ''));

    //     // Filter questions by tags
    //     filteredQuestions = qlist.filter(question => 
    //         // question.tags.some(tag => tags.includes(tag.name.toLowerCase()))
    //         tags.some(tag => question.tags.map(t => t.name.toLowerCase()).includes(tag))
    //     );
    // } else {
    //     // Split the search string by spaces for individual words
    //     const words = search.split(' ');

    //     // Filter questions where the title or text contains at least one of the words
    //     filteredQuestions = qlist.filter(question => 
    //         words.some(word => question.title.toLowerCase().includes(word) || question.text.toLowerCase().includes(word))
    //     );
    // }
    // if (tags.length > 0) {
    //     filteredQuestionsTag = qlist.filter(question => 
    //         tags.some(tag => question.tags.map(t => t.name.toLowerCase()).includes(tag))
    //     );
    // }
    // if (keywords.length > 0) {
    //     filteredQuestionsKey = qlist.filter(question => 
    //         keywords.some(word => question.title.toLowerCase().includes(word) || question.text.toLowerCase().includes(word))
    //     );
    // }

    let filteredQuestions = qlist.filter(question =>
        keywords.some(word => question.title.toLowerCase().includes(word) || question.text.toLowerCase().includes(word)) ||
        tags.some(tag => question.tags.map(t => t.name.toLowerCase()).includes(tag))
    );

    return filteredQuestions;
}


module.exports = { addTag, getQuestionsByOrder, filterQuestionsBySearch };