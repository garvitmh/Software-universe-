[VERDICT: ON_TRACK]

Excellent.

KnowledgeGraph is now the curriculum map of Software Universe.

We are now ready to build something extremely important:

QuestionGenerator.js

This is where Software Universe stops asking static questions and starts asking the right questions.

Philosophy

QuestionGenerator is NOT:

JavaScript
pickRandomQuestion()

That would destroy everything we've built.

Instead:

QuestionGenerator should act like a mentor.

It should ask:

"Given what this learner knows, what should I ask next?"

Create
components/professor/

QuestionGenerator.js
Inputs

QuestionGenerator consumes:

LearnerModel

↓

ConceptMasteryEngine

↓

KnowledgeGraph

↓

Current Concept

↓

Current World
Output

Returns:

JavaScript
{
  question,
  concept,
  difficulty,
  reason,
  confidenceTarget,
  recommendedFollowups
}
Main Function
JavaScript
generateNextQuestion(
  learner,
  mastery,
  graph,
  currentConcept
)

Pure function.

No UI.

No React.

Strategy Priority
1. Weak Concepts

Highest priority.

Example:

Redis mastery = 25

Ask:

What is Redis used for?

before moving on.

2. Weak Neighborhood

Using KnowledgeGraph:

Weak:

Retries

Nearby:

Queue

DLQ

Eventual Consistency

Questions should cluster.

This creates coherent learning.

3. Confidence Calibration

Very important.

Case:

Mastery = 90

Confidence = 20

Ask easier questions.

Build confidence.

Case:

Mastery = 20

Confidence = 95

Ask misconception questions.

Challenge overconfidence.

Question Types

Support:

Recall

Why

Tradeoff

Failure

Scaling

Architecture

Misconception

Giant Company

Example progression:

Beginner

What is a queue?

Intermediate

Why do we use queues?

Senior

What breaks without queues?

Staff

Why might RabbitMQ be preferred over Redis?

Architect

If queues disappeared tomorrow, how would you redesign the system?
Misconception Questions

One of the crown jewels.

Example:

Common misconception:

JWT encrypts data.

Ask:

True or False?

JWT keeps data secret.
Follow-up Chains

Question:

What is idempotency?

Correct?

↓

Next:

What breaks without idempotency?

Correct?

↓

Next:

How does Stripe use idempotency?

Correct?

↓

Next:

Design an idempotent payment system.

Questions should evolve naturally.

Recovery Mode

Triggered by:

EXPLAIN_SIMPLER

QuestionGenerator should switch to:

Mental model

↓

Burger Farm example

↓

Simple question

This is mentor behavior.

Curiosity Questions

Occasionally inject:

Did you know?

Example:

Netflix runs thousands of microservices.

Why do they need distributed tracing?

These questions are for wonder, not assessment.

Core Functions
generateNextQuestion()

Main entry point.

generateRecoveryQuestion()

For struggling learners.

generateChallengeQuestion()

For strong learners.

generateMisconceptionQuestion()

Correct false beliefs.

generateCuriosityQuestion()

Create excitement.

generateFollowupQuestion()

Build chains.

After QuestionGenerator

Build:

ProfessorBrain.js

This may become the most important file in the entire project.

Inputs:

LearnerModel

↓

ConceptMastery

↓

KnowledgeGraph

↓

QuestionGenerator

↓

Current World

Outputs:

Explain Simpler

Explain Deeper

Mental Model

Burger Farm Example

Ask Question

Recommend Next Concept

Recommend Next World
Then

Observatory.

The Sacred Order
AdaptiveDifficultyEngine

↓

LearnerModel

↓

ProfessorState

↓

ConceptMasteryEngine

↓

KnowledgeGraph

↓

QuestionGenerator

↓

ProfessorBrain

↓

Observatory

Do not violate this order.

Every layer exists to make the next layer intelligent.

[END_ARCHITECT_RESPONSE]