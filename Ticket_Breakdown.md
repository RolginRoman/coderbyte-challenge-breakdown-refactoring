# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here
1. Firstly, to recap what we have: DB with 3 tables. Each shift is assigned to a facility in the table `Shifts`. `Facilities` and `Agents` store the info about participants in the process.
2. As the system needs the option to override `Agent#id` in reports I would decouple reporting engine to a separate module and describe an external contract for it.
Reports have to contain information about Agents that worked in this Facility. Thus, the reports engine would have this form of input: Facility, Quarter (Date), and List of agents with the aggregated time of shifts that they had. Reports engine shouldn't care about ids origin: external (custom facility's ids) or internal (db primary keys or similar).
3. I'm guessing that now reports know the structure of the system's data and database explicitly and that's why reports cannot be easily moved to external IDs.

### Tasks list of that Epic could be structured this way
1. Describe the Reporting Engine Module API [Blocking]
    1. DOD: Described data model structure of inputs for separate reports module and outputs (maybe an async message to RabbitMq, SQS with generated link to report, webhook call with notification of the generation status, polling response to external service with request/response id, etc.)
    2. Estimate: 2h, 1 storypoint, depending on the team agreements. It's not the quickest task (not tend to 0 min) because it could involve cross-team communication or external system integration PoC if such systems like SQS aren't integrated at that moment.
2. Store Facility-Agent custom ids relations
    1. DOD: Separate table for FacilityAgents with an id that Facility set to Agent. Provide a way for a customer to set that info (FrontEnd, BackEnd)
    2. Estimate: 4h, 2 storypoints
    3. Subtask 1: Frontend. Provide a form for the Facility to assign a custom id for a particular Agent
    4. Subtask 2: Backend. Provide an API for Frontend to store custom id with inputs: facilityId, agentId, customId (for this pair of Facility and Agent).    
3. Separation of the Reporting Engine Module  
    1. DOD: separate module that can generate pdf and notify the producer of a pdf's request about the result.
    2. Esimate: 8h, 2 storypoints. As we know that pdf generation is set up (it generates PDF with internal IDs) we don't need to design PDF generation. Everything that needs to be done here is to satisfy the API from #1.
    3. As API is already approved, work with this module isn't blocked by anything. Could be paralleled within a team.
    4. The module generates a PDF with provided input and notifies about the status of this process. It doesn't know anything about underneath structure of DB and shouldn't call any available APIs of backend services. So it's stateless by the design.
4. Integration of External Service and the Reporting Module
    1. DOD: PDFs generated with custom Agents' ids if they were set by Facility.
    2. Estimate: 8h, 2 storypoints. Depends on a decision that was made in Task #1 about a way of communication between services.
    3. As API is already approved, work with this module isn't blocked by anything. Could be paralleled within a team.   
    4. This External Service forms the input for the Reporting Engine. If Facility had set the custom ID for Agent (Task #2) then the input should contain that custom id. Otherwise, use an internal id.
    5. Listen to the result of the Reporting Module and provide a link to report for a customer (via email, frontend, etc).

Tasks #2, #3, #4 are independent and could be done separately.
 