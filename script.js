"use strict";

function getLearnerData(assignments, submissions) {
  const results = [];

  // Map assignmentId -> assignment info (so we can get dueDate)
  const assignmentsById = new Map();
  for (const a of assignments) {
    assignmentsById.set(a.id, a);
  }

  // Map learnerId -> Map(assignmentId -> submissionData)
  const learnerMap = new Map();
  for (const sub of submissions) {
    if (!learnerMap.has(sub.learner_id)) {
      learnerMap.set(sub.learner_id, new Map());
    }
    learnerMap.get(sub.learner_id).set(sub.assignment_id, {
      score: sub.submission.score,
      pointsPossible: sub.submission.points_possible,
      submittedAt: new Date(sub.submission.submitted_at)
    });
  }

  // Loop through each learner
  for (const [learnerId, assignmentsMap] of learnerMap.entries()) {
    let totalScore = 0;
    let totalPossible = 0;

    const assignmentPercentages = {};

    // Loop through each assignment submission
    for (const [assignmentId, data] of assignmentsMap.entries()) {
      let score = data.score;
      const pointsPossible = data.pointsPossible;
      const submittedAt = data.submittedAt;

      const dueDate = new Date(assignmentsById.get(assignmentId).due_date);

      // Late penalty (10% off)
      if (submittedAt > dueDate) {
        score = Math.max(score - pointsPossible * 0.1, 0);
      }

      totalScore += score;
      totalPossible += pointsPossible;

      assignmentPercentages[assignmentId] = Number((score / pointsPossible).toFixed(3));
    }

    const average = totalPossible === 0 ? 0 : totalScore / totalPossible;

    const learnerResult = {
      id: learnerId,
      avg: Number(average.toFixed(3)),
      ...assignmentPercentages
    };

    results.push(learnerResult);
  }

  return results;
}

// ✅ Only attach to window if you're in a browser
if (typeof window !== "undefined") {
  window.getLearnerData = getLearnerData;
}
