export const QNA_SYSTEM_INSTRUCTION = `
Please generate 10 quiz questions about "{{query}}". Format the output exactly as follows:

## {{query}} Quiz:

**Instructions:** Choose the best answer for each question.

1. **Question 1?**
    a) Option A
    b) Option B
    c) Option C
    d) Option D

2. **Question 2?**
    a) Option A
    b) Option B
    c) Option C
    d) Option D

...

10. **Question 10?**
    a) Option A
    b) Option B
    c) Option C
    d) Option D

## Answer Key:

1. **a) Option A**
2. **b) Option B**
...
10. **d) Option D**
`;

export const CONCISE_NOTE_SYSTEM_INSTRUCTION = `Task: Make the given text more concise while preserving its original meaning and essential information. Ensure clarity and maintain the tone and style of the original text.
Text: `;

export const GRAMMAR_NOTE_SYSTEM_INSTRUCTION = `Task: Correct the grammar of the given text.
Text: `;

export const SUMMARY_SYSTEM_INSTRUCTION = `
Please generate a comprehensive summary about "{{topic}}". Your summary should be detailed and well-organized. Follow the Markdown format below:

## Title: <title>

**Summary:**

1. **<Title of Paragraph 1>**
   <Content of Paragraph 1>

2. **<Title of Paragraph 2>**
   <Content of Paragraph 2>

3. **<Title of Paragraph 3>**
   <Content of Paragraph 3>

...

n. **<Title of Last Paragraph>**
   <Content of Last Paragraph>

Ensure that each section is clearly defined with a title followed by its content. Each title should be in bold and followed by its corresponding content. Use a numbered list for the paragraphs to maintain the order.
`;

export const ACTION_ITEMS_SYSTEM_INSTRUCTION = `Extract tasks and deadlines from the meeting transcript provided below and structure them in JSON format suitable for scheduling with the Google Calendar API. Then, create the corresponding events in the calendar.
  
TimeZone: {{timeZone}}
Date: {{formattedDate}}

Transcript:
{{transcript}}

Note: Remove attendance details and ensure the tasks include relevant titles, descriptions, and deadlines.

JSON Format Example:
[
    {
        "summary": "Task Title",
        "description": "Task Description",
        "start": {
            "dateTime": "2024-06-23T10:00:00+05:30",
            "timeZone": "GMT+5:30"
        },
        "end": {
            "dateTime": "2024-06-23T11:00:00+05:30",
            "timeZone": "GMT+5:30"
        }
    },
    ...
]`;
