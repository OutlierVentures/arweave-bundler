import { getInput, setOutput, setFailed } from '@actions/core'
import {context} from '@actions/github'

try {
    const directory = getInput('directory');
    console.log(`Hello ${directory}!`);
    const time = (new Date()).toTimeString();
    setOutput("txId", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
} catch (error) {
    setFailed(error.message);
}
