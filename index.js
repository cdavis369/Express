const express = require('express');
const stats = require('stats-lite');
const ExpressError = require('./error-handler');

const app = express();

app.get('/mean', (req, res) => {
    let {term, nums} = req.query;

    if (Object.keys(req.query).length == 0)
        return res.status(400).send('Numbers are required.');
 
    const e = errorCheck(nums.split(','));
    if (e['errors'])
        return res.status(400).send(`Not valid input: ${e['wrong-input']}`)
 
    nums = convertArray(nums.split(','));
    const ans = stats.mean(nums).toFixed(1);
    const response = {
        operation: 'mean',
        value: ans
    };
    return res.json(response);
});

app.get('/median', (req, res) => {
    let {term, nums} = req.query;

    if (Object.keys(req.query).length == 0)
        return res.status(400).send('Numbers are required.');
 
    const e = errorCheck(nums.split(','));
    if (e['errors'])
        return res.status(400).send(`Not valid input: ${e['wrong-input']}`)

    nums = convertArray(nums.split(','));
    const ans = stats.median(nums).toFixed(1)
    const response = {
        operation: 'median',
        value: ans
    };
    return res.json(response);
});

app.get('/mode', (req, res) => {
    let {term, nums} = req.query;

    if (Object.keys(req.query).length == 0)
        return res.status(400).send('Numbers are required.');
 
    const e = errorCheck(nums.split(','));
    if (e['errors'])
        return res.status(400).send(`Not valid input: ${e['wrong-input']}`)

    nums = convertArray(nums.split(','));
    const ans = stats.mode(nums);
    const response = {
        operation: 'mode',
        value: null
    };
    if (ans.constructor.name == 'Number') {
        response['value'] = ans;
    }
    if (ans.constructor.name == 'Set') {
        const modes = [];
        for (const num of ans) modes.push(num);
        modes.sort((a, b) => a - b);
        response['value'] = modes;
    }
    else {
        response['value'] = "None";
    }
    return res.json(response);
});

function errorCheck(arr) {
    const errors = {'errors':false, 'wrong-input': []}
    for (let i in arr) {
        if (isNaN(parseInt(arr[i]))) {
            errors['errors'] = true;
            errors['wrong-input'].push(arr[i]);
        }
    }
    return errors;
}

function convertArray(arr) {
    const intArray = [];
    for (let i in arr)  {
        const num = parseInt(arr[i]);
        intArray.push(num);
    }
    return intArray.sort((a, b) => a - b);
}

app.listen(3000, () => { console.log("App on port 3000"); });