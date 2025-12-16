"use strict";




const results = [];




// Loop through each learner

for (const [learnerId, assignments] of learnerMap.entries()) {




let totalScore = 0;

let totalPossible = 0;




const assignmentPercentages = {};




// Loop through each assignment submission

for (const [assignmentId, data] of assignments.entries()) {




let score = data.score;

const pointsPossible = data.pointsPossible;

const submittedAt = data.submittedAt;




// Apply late penalty if submitted after due date

const dueDate = assignmentsById.get(assignmentId).dueDate;

if (submittedAt > dueDate) {

score = Math.max(score - pointsPossible * 0.1, 0);

}




// Add to totals for weighted average

totalScore += score;

totalPossible += pointsPossible;




// Calculate percentage score

assignmentPercentages[assignmentId] = Number((score / pointsPossible).toFixed(3));

}




// Calculate weighted average

const average = totalPossible === 0 ? 0 : totalScore / totalPossible;




// Build learner result object

const learnerResult = {

id: learnerId,

avg: Number(average.toFixed(3))

};




// Add assignment percentages to learner object

for (const assignmentId in assignmentPercentages) {

learnerResult[assignmentId] = assignmentPercentages[assignmentId];

}




// Add learner result to final array

results.push(learnerResult);

}




// Return final formatted results

return results;




try {

// ...code that may throw

} catch (err) {

console.error(err);

}




// -----------------------------------------------------------

// Make function accessible in browser-based grading systems

// -----------------------------------------------------------

window.getLearnerData = getLearnerData;